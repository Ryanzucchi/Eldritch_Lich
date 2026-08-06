# Runtime de Plugins

O runtime define manifestos de extensões de editor e executa hooks remotos isolados.

* `EditorPluginManifest` declara os hooks `beforeSave`, `afterLoad` e `onEditorCommand`.
* `invokeRemotePlugin` carrega um módulo por URL em Web Worker, limita a execução a cinco segundos e só troca payloads serializáveis.
* O Worker não recebe DOM, cookies ou IndexedDB do aplicativo. Registro e interface de instalação continuam pendentes.
