"""Local-only Portuguese linguistic companion for Eldritch Lich.

The first startup downloads Stanza's Portuguese model into the mounted /models
volume. Afterwards every analysis stays on localhost and works without APIs.
"""
from functools import lru_cache
import os

import stanza
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Eldritch local linguistics", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], allow_methods=["POST", "GET"], allow_headers=["Content-Type"])


class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=500_000)
    language: str = "pt"


@lru_cache(maxsize=1)
def portuguese_pipeline():
    resources_dir = os.environ.get("STANZA_RESOURCES_DIR", "/models")
    try:
        return stanza.Pipeline("pt", processors="tokenize,pos,lemma,ner,depparse", dir=resources_dir, use_gpu=False, verbose=False)
    except Exception:
        stanza.download("pt", dir=resources_dir, verbose=False)
        return stanza.Pipeline("pt", processors="tokenize,pos,lemma,ner,depparse", dir=resources_dir, use_gpu=False, verbose=False)


@app.get("/health")
def health():
    return {"status": "ok", "engine": "stanza-local"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    if request.language != "pt":
        raise HTTPException(status_code=400, detail="Somente pt é suportado pelo serviço local.")
    document = portuguese_pipeline()(request.text)
    entities = []
    for entity in document.ents:
        raw_label = entity.type.upper()
        label = {
            "PERSON": "PER", "PER": "PER",
            "LOCATION": "LOC", "LOC": "LOC", "GPE": "LOC", "FAC": "LOC",
            "ORGANIZATION": "ORG", "ORG": "ORG",
            "MISC": "MISC", "MISCELLANEOUS": "MISC",
        }.get(raw_label)
        if label is None:
            continue
        entities.append({"text": entity.text, "label": label, "start": entity.start_char, "end": entity.end_char})
    return {"engine": "stanza-local", "entities": entities}
