### Caso de Uso: Cadastrar fichas de criaturas/monstros (bestiário)

**ID:** UC-276  
**Requisito relacionado:** RF-276 (cadastrar fichas de criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (fauna e flora) do projeto.  
**Gatilho:** O usuário clica em "Nova Criatura / Monstro" no menu do bestiário.  

**Fluxo principal:**
1. O usuário acessa o menu lateral e clica em "Bestiário" -> "Nova Ficha de Criatura".
2. O sistema abre uma ficha técnica padrão do bestiário contendo campos: Nome da Espécie, Classificação, Descrição Física, Habilidades/Poderes, Fraquezas e Dieta.
3. O usuário insere as informações da criatura.
4. O usuário clica em "Salvar".
5. O sistema grava o registro de criatura no banco de dados.
6. A criatura passa a constar na barra lateral sob o diretório "Bestiário".

**Fluxos alternativos:**
- *Criar subespécie:* O usuário duplica a ficha de uma criatura para criar uma variação (subespécie) herdando a maioria dos atributos e alterando apenas fraquezas ou cores.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema solicita um nome diferente caso a espécie já exista.

**Pós-condições:** A ficha da criatura é cadastrada no bestiário do projeto.

**Critérios de aceite:**
- [ ] A ficha do bestiário deve aceitar marcações de tags personalizadas para permitir filtros de busca rápidos.
- [ ] O salvamento da nova criatura no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
