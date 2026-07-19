# TESE DE DOUTORADO

---

**UNIVERSIDADE FEDERAL DE CIÊNCIAS DA COMPUTAÇÃO E LINGUÍSTICA APLICADA**
**PROGRAMA DE PÓS-GRADUAÇÃO EM INFORMÁTICA**

---

<br><br><br>

# RECONHECIMENTO DE ENTIDADES NOMEADAS EM TEXTOS FICCIONAIS EM LÍNGUA PORTUGUESA: UMA ABORDAGEM HÍBRIDA PARA RESOLUÇÃO DE CORREFERÊNCIA E IDENTIFICAÇÃO DE PERSONAGENS SECUNDÁRIOS EM ROMANCES DE LONGA EXTENSÃO

<br><br><br>

**Autor:** Carlos Eduardo Martins Ferreira

**Orientador:** Prof. Dr. Antônio Ricardo Gomes da Silva

<br><br><br>

Tese apresentada ao Programa de Pós-Graduação em Informática da Universidade Federal de Ciências da Computação e Linguística Aplicada como requisito parcial para obtenção do grau de **Doutor em Informática**.

<br><br><br>

**Área de concentração:** Processamento de Linguagem Natural e Computação Literária

**Linha de pesquisa:** Extração de Informação e Reconhecimento de Entidades em Domínio Literário

<br><br><br>

---

**Brasília – DF**
**2026**

---

<br><br><br>

---

## FOLHA DE ROSTO

**UNIVERSIDADE FEDERAL DE CIÊNCIAS DA COMPUTAÇÃO E LINGUÍSTICA APLICADA**
**PROGRAMA DE PÓS-GRADUAÇÃO EM INFORMÁTICA**

<br><br>

**CARLOS EDUARDO MARTINS FERREIRA**

<br><br>

# RECONHECIMENTO DE ENTIDADES NOMEADAS EM TEXTOS FICCIONAIS EM LÍNGUA PORTUGUESA: UMA ABORDAGEM HÍBRIDA PARA RESOLUÇÃO DE CORREFERÊNCIA E IDENTIFICAÇÃO DE PERSONAGENS SECUNDÁRIOS EM ROMANCES DE LONGA EXTENSÃO

<br><br>

Tese apresentada ao Programa de Pós-Graduação em Informática da Universidade Federal de Ciências da Computação e Linguística Aplicada como requisito parcial para obtenção do grau de **Doutor em Informática**.

**Área de concentração:** Processamento de Linguagem Natural e Computação Literária

**Orientador:** Prof. Dr. Antônio Ricardo Gomes da Silva

<br><br>

**Aprovada em:** ___/___/2026

**Banca Examinadora:**

| Membro | Instituição |
|--------|-------------|
| Prof. Dr. Antônio Ricardo Gomes da Silva (Presidente) | UFCLA |
| Profa. Dra. Maria Clara Pereira de Andrade | Universidade de São Paulo (USP) |
| Prof. Dr. João Paulo Santos Ramos | Universidade Estadual de Campinas (UNICAMP) |
| Profa. Dra. Ana Beatriz Costa Lima | Universidade Federal do Rio de Janeiro (UFRJ) |

<br><br>

---

**Brasília – DF**
**2026**

---

<br><br>

## FICHA CATALOGRÁFICA

```
F383r  Ferreira, Carlos Eduardo Martins
         Reconhecimento de Entidades Nomeadas em Textos Ficcionais em
       Língua Portuguesa: uma abordagem híbrida para resolução de
       correferência e identificação de personagens secundários em
       romances de longa extensão / Carlos Eduardo Martins Ferreira. --
       Brasília, 2026.
         312 f. : il.

         Orientador: Antônio Ricardo Gomes da Silva.
         Tese (Doutorado) -- Universidade Federal de Ciências da
       Computação e Linguística Aplicada, Programa de Pós-Graduação em
       Informática, 2026.

         1. Reconhecimento de entidades nomeadas. 2. NLP literário.
       3. Textos ficcionais. 4. Correferência. 5. Língua portuguesa.
       I. Silva, Antônio Ricardo Gomes da. II. Título.

                                           CDU 004.912:82
```

---

## DEDICATÓRIA

À literatura brasileira, que nos ensina que as palavras não são apenas dados, mas mundos inteiros esperando para ser descobertos.

---

## AGRADECIMENTOS

O autor agradece ao Programa de Pós-Graduação em Informática da UFCLA, ao orientador Prof. Dr. Antônio Ricardo Gomes da Silva pela orientação criteriosa e rigorosa, aos membros da banca examinadora por suas contribuições enriquecedoras, à Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (CAPES) pelo suporte financeiro, e à comunidade de pesquisa de Processamento de Linguagem Natural que, com seus trabalhos seminais e inovadores, tornou possível esta investigação.

---

"Nas fronteiras entre a linguagem e a computação, encontra-se o desafio de fazer as máquinas compreenderem não apenas as palavras, mas os mundos que elas constroem."

