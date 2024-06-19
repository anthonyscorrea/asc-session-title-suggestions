const NAME = "/title"

const template_path = "modules/asc-session-title-suggestions/templates"

const TEMPLATES = {
    'suggestion': {
        flavor:`${template_path}/suggestion-flavor.hbs`,
        content:`${template_path}/suggestion-content.hbs`
    },
    "suggestionList": {
        flavor:`${template_path}/suggestion-list-flavor.hbs`,
        content:`${template_path}/suggestion-list-content.hbs`
    }
}

function registerClipboardCopyButton() {
    copyToClipboardListener = (event) => {
        const text=event.target.dataset.clipboardText;
        console.log(`Session Title Suggestions | Copying "${text}" to clipboard`);
        navigator.clipboard.writeText(text)
      }
    $(document).on('click', 'a.clipboard', copyToClipboardListener);
}


function registerCustomChatCommands() {
    game.chatCommands.unregister(NAME)
    game.chatCommands.register({
        name: NAME,
        module: "_chatcommands",
        aliases: ["/t", "t/"],
        description: "Suggest a title for this episode",
        icon: '<i class="fa-solid fa-podcast"></i>',
        requiredRole: "NONE",
        callback: async (chat, parameters, messageData) => {
            const titleSuggestion = parameters
            const newMessageData = {}
            newMessageData.content = await renderTemplate(TEMPLATES.suggestion.content, {content:titleSuggestion})
            newMessageData.flavor = await renderTemplate(TEMPLATES.suggestion.flavor)
            newMessageData.flags = {session_title_suggestion: titleSuggestion}
            return newMessageData;
        },
        autocompleteCallback: (menu, alias, parameters) => [game.chatCommands.createInfoElement("Enter a message.")],
        closeOnComplete: true
    });
    
    game.chatCommands.unregister(NAME+"s")
    game.chatCommands.register({
            name: NAME+"s",
            module: "_chatcommands",
            aliases: ["/ts"],
            description: "List all titles for the most recent episode",
            icon: '<i class="fa-solid fa-podcast"></i>',
            requiredRole: "GAMEMASTER",
            callback: async (chat, parameters, messageData) => {
                const newMessageData = {}
                const suggestions = game.messages.filter(m => {
                    return m.flags.session_title_suggestion
                })
                
                const last_message_date = new Date(suggestions[suggestions.length-1].timestamp)
                const filtered_suggestions = suggestions.filter(m=>{
                    const message_date = new Date(m.timestamp)
                    return message_date.toDateString() == last_message_date.toDateString()
                })
                newMessageData.content = await renderTemplate(TEMPLATES.suggestionList.content, {messages:filtered_suggestions })
                newMessageData.flavor = await renderTemplate(TEMPLATES.suggestionList.flavor, {date:last_message_date.toDateString()})
                return newMessageData;
            },
            autocompleteCallback: (menu, alias, parameters) => [game.chatCommands.createInfoElement("Enter a message.")],
            closeOnComplete: true
        });
}

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
    //This code runs once the Foundry VTT software begins its initialization workflow
    registerCustomChatCommands();
    registerClipboardCopyButton();
    loadTemplates(flavor_template_path)
    Object.values(TEMPLATES.suggestion).forEach((template_path)=>{
        loadTemplates(template_path)
    }
    )
    Object.values(TEMPLATES.suggestionList).forEach((template_path)=>{
        loadTemplates(template_path)
    }
    )
});

Hooks.on("ready", function() {
    //This code runs once core initialization is ready and game data is available.
});