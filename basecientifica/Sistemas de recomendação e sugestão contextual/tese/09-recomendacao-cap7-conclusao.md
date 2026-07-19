# 7 CONCLUSÃO

Esta tese investigou como arquiteturas híbridas de recomendação contextual podem sugerir conteúdo relevante a escritores de ficção sem interromper o flow criativo. O framework ContextRec-Writer proposto integra três fontes complementares de recomendação (filtragem colaborativa por embeddings, navegação no Grafo de Universo Ficcional e RAG sobre base de notas) em uma arquitetura de três modos de interação (passivo, ativo e brainstorm), cujas políticas de apresentação são fundamentadas em evidências empíricas de CreativeFlow (2024) e Human Agency (2024).

A contribuição mais original é o uso do GUF como contexto primário — uma inversão do paradigma da filtragem colaborativa que coloca o universo proprietário do autor como fonte central de relevância, e não o comportamento coletivo de outros usuários.

Os achados desta tese têm implicações práticas diretas para o design de ferramentas de apoio à escrita criativa: o controle do usuário sobre quando receber sugestões é essencial para preservação de autoria; a intrusividade é o principal fator de rejeição; e a coerência com o universo ficcional proprietário do autor é mais valorizada do que a qualidade absoluta das sugestões.

**Trabalhos futuros:** avaliação empírica com 30 escritores conforme protocolo proposto; detecção automática de estado de flow para personalização adaptativa; avaliação de equidade das recomendações de referências literárias.
