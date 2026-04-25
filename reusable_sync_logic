# Blueprint de Sincronização GitHub <-> LocalStorage

Este documento serve como guia definitivo para implementar o sistema de sincronização automática e versionamento por timestamp (Single Source of Truth) em projetos web baseados em LocalStorage.

## 1. O Arquivo de Dados (`js/data.js`)

Este arquivo atua como o banco de dados remoto no GitHub. Ele deve ser auto-executável e inteligente.

```javascript
const defaultData = {
    profile: { /* dados... */ },
    services: [ /* dados... */ ],
    // ... todos os campos do seu sistema
    lastUpdated: 0 // Timestamp de controle
};

function initDatabase() {
    const localLastUpdated = localStorage.getItem("portfolio_last_updated") || "0";
    const remoteLastUpdated = (defaultData.lastUpdated || 0).toString();

    // Sincroniza se o local estiver vazio OU o remoto for mais recente
    if (!localStorage.getItem("portfolio_profile") || parseInt(remoteLastUpdated) > parseInt(localLastUpdated)) {
        console.log("Detectada versão mais recente no GitHub. Atualizando...");
        
        localStorage.setItem("portfolio_profile", JSON.stringify(defaultData.profile));
        localStorage.setItem("portfolio_services", JSON.stringify(defaultData.services));
        // ... repita para todos os campos em snapshot
        
        localStorage.setItem("portfolio_last_updated", remoteLastUpdated);
        
        // Recarrega se os dados antigos existiam (evita loop na primeira carga)
        if (localLastUpdated !== "0") {
            setTimeout(() => window.location.reload(), 500);
        }
    }
}
window.initDatabase = initDatabase;
```

## 2. Lógica do Painel Admin (`admin/admin.js`)

### Carregamento de Segurança
Chame `initDatabase` antes de qualquer edição para garantir que o Admin não sobreponha dados novos com uma versão antiga do cache.

```javascript
window.onload = function() {
    if (window.initDatabase) window.initDatabase();
    // carregar formulários...
};
```

### Função de Sync (Push para GitHub)
Ao salvar, gere um novo timestamp e reconstrua o arquivo `data.js` programaticamente.

```javascript
async function syncToGitHub() {
    const lastUpdated = Date.now();
    
    // 1. Snapshot dos dados atuais
    const snapshot = {
        profile: localStorage.getItem('portfolio_profile'),
        services: localStorage.getItem('portfolio_services'),
        // ...
        lastUpdated: lastUpdated
    };

    // 2. Template de reconstrução do arquivo
    // NOTA: Os dados já estão em string JSON, por isso não usamos JSON.stringify aqui.
    const fileContent = `const defaultData = {
    profile: ${snapshot.profile},
    services: ${snapshot.services},
    lastUpdated: ${snapshot.lastUpdated}
};

function initDatabase() {
    const localLastUpdated = localStorage.getItem("portfolio_last_updated") || "0";
    const remoteLastUpdated = (defaultData.lastUpdated || 0).toString();
    if (!localStorage.getItem("portfolio_profile") || parseInt(remoteLastUpdated) > parseInt(localLastUpdated)) {
        localStorage.setItem("portfolio_profile", JSON.stringify(defaultData.profile));
        localStorage.setItem("portfolio_services", JSON.stringify(defaultData.services));
        localStorage.setItem("portfolio_last_updated", remoteLastUpdated);
        if (localLastUpdated !== "0") { setTimeout(() => window.location.reload(), 500); }
    }
}
window.initDatabase = initDatabase;`;

    // 3. Upload via API do GitHub (PUT)
    // - Obter o SHA do arquivo atual
    // - Enviar base64 do novo fileContent
}
```

## 3. Requisitos de Implementação

1.  **Ordem dos Scripts**: `js/data.js` deve ser o primeiro script carregado no `<head>` ou início do `<body>`.
2.  **Identificadores**: Use prefixos únicos no LocalStorage (ex: `portfolio_`) para evitar conflitos com outros sites.
3.  **Segurança**: Nunca publique o seu **GitHub Token** em arquivos públicos/frontend. Ele deve ser configurado apenas via painel admin e guardado no LocalStorage do administrador.

---
> [!IMPORTANT]
> **O Campo `lastUpdated`**
> Ele é o "relógio" do sistema. Se o valor no GitHub for maior que o do PC local, o PC local obedece e se atualiza. Isso permite que você mude de computador e o trabalho continue de onde parou.

> [!TIP]
> **Resolução de Conflitos Git**
> Se você editar o arquivo manualmente no GitHub e depois tentar fazer um Push via Admin, poderá ocorrer um conflito. Sempre faça um `git pull` ou use a função de sincronização do painel para manter a ordem.
