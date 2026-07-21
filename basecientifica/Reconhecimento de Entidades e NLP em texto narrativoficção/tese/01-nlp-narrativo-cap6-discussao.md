# 5 DISCUSSÃO

A análise da arquitetura proposta lança luz sobre o panorama atual do PLN aplicado à literatura, especialmente frente às barreiras linguísticas da língua portuguesa. 

## 5.1 Limitações da Proposta
A primeira limitação latente desta abordagem reside no processamento das resoluções de correferência de longa distância. Ainda que influenciado pelos *insights* narratológicos de Jahan et al. (2020) e pelos *datasets* seminais (BAMMAN; LEWKE; MANSOOR, 2020), manter o rastreamento em romances com centenas de páginas fragmenta a janela de atenção de modelos mais econômicos, forçando a delegação para instâncias LLM locais custosas (SARCINELLI; SILVA, 2025). O custo temporal para o processamento de um livro inteiro ainda é considerável. Embora o tempo de processamento híbrido médio seja baixo (340ms por página), a varredura sequencial e a resolução de correferência em romances inteiros de 300 páginas acumulam um tempo total de cerca de 1.7 minutos na GPU RTX 3060, o que requer uma arquitetura assíncrona com processamento em segundo plano (background queue) na plataforma de escrita.

## 5.2 Limitações na Literatura
Os trabalhos listados evidenciam uma concentração no inglês. Modelos como LitBank e LitNER pavimentaram métodos sofisticados, mas as morfologias e sintaxes românicas introduzem ambiguidades exclusivas — pronomes ocultos, flexão verbal que denota o sujeito indiretamente — não tratáveis via abordagens prontas de Bamman, Popat e Shen (2019). Apesar do esforço monumental de Silva e Moro (2024) com o PPORTAL_ner, o mapeamento exaustivo de literatura sub-representada contemporânea ainda é escasso. O uso de entity linking, fortemente focado na Wikidata (SCHARPF et al., 2022; SCHARPF et al., 2026), não atende diretamente à ficção original recém-criada (sem página wiki associada).

## 5.3 Riscos e Desafios Técnicos
Na implementação prática, o risco de alucinações por parte do modelo de zero-shot LLM e a propagação de erros (*error cascades*) no pipeline de dois estágios é elevado. A desambiguação de pronomes ambíguos para protagonistas e coadjuvantes (ŁAJEWSKA et al., 2021) é crítica; a ligação incorreta feita pelo OpenTapioca modificado para o *Knowledge Graph* local (DELASALLES et al., 2020; SARKAR et al., 2025) corrompe a extração da rede social da obra.

## 5.4 Contribuições 
O sistema desenvolvido entrega uma contribuição singular: a conciliação teórica das correntes de NER em *datasets* históricos portugueses (SARCineLLI et al., 2025) com as abordagens de rede e narratologia (CANÁRIO et al., 2025; SANTANA et al., 2023; JAHAN; FINLAYSON, 2019). Praticamente, inaugura um caminho arquitetural autônomo, seguro e leve, capacitando ferramentas web voltadas a criadores e protegendo a propriedade intelectual criativa da dependência de *big-techs*.
