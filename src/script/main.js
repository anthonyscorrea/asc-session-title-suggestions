const NAME = "/title"

const TEMPLATE = " "

function copyToClipboardListener(event) {
  const text=event.target.dataset.clipboardText;
  console.log(text);
  navigator.clipboard.writeText(text)
}

game.chatCommands.unregister(NAME)
game.chatCommands.unregister(NAME+"s")
game.chatCommands.register({
        name: NAME,
        module: "_chatcommands",
        aliases: ["/t"],
        description: "Suggest a title for this episode",
        icon: '<i class="fa-solid fa-podcast"></i>',
        requiredRole: "NONE",
        callback: (chat, parameters, messageData) => {
            console.log('test');
            return { content: `<blockquote>${parameters}</blockquote>`, flavor: '<i class="fa-solid fa-podcast"></i> suggesting an episode title...', flags:{title_suggestion: true}};
        },
        autocompleteCallback: (menu, alias, parameters) => [game.chatCommands.createInfoElement("Enter a message.")],
        closeOnComplete: true
    });
    
 game.chatCommands.register({
        name: NAME+"s",
        module: "_chatcommands",
        aliases: ["/ts"],
        description: "List all titles for the most recent episode",
        icon: '<i class="fa-solid fa-podcast"></i>',
        requiredRole: "GAMEMASTER",
        callback: (chat, parameters, messageData) => {
            const content = document.createElement('ul')
            const parser = new DOMParser()

            const suggestions = game.messages.filter(m => {
                return m.flags.title_suggestion
            })
            
            const last_message_date = new Date(suggestions[suggestions.length-1].timestamp)
            
            suggestions.filter(m=>{
                const message_date = new Date(m.timestamp)
              return message_date.toDateString() == last_message_date.toDateString()
            }).forEach(m=>{
                const content_doc = parser.parseFromString(m.content,'text/html')
                const element = document.createElement('li')
                const icon = document.createElement('a')
                icon.classList.add('fa-regular')
                icon.classList.add('fa-clipboard')
                icon.classList.add('clipboard')
                icon.style.paddingLeft='.5em'
                icon.style.paddingRight='.5em'
                icon.dataset.clipboardText=content_doc.firstElementChild.textContent
                const span = document.createElement('span')
                span.classList.add('message-content')
                span.textContent = `"${content_doc.firstElementChild.textContent}" - ${m.user?.name}`
                element.appendChild(icon)
                element.appendChild(span)
                content.appendChild(element)
            })
                        
            return { content: content.outerHTML, flavor: `<i class="fa-solid fa-podcast"></i> title suggestions (${last_message_date.toDateString()}):`};
        },
        autocompleteCallback: (menu, alias, parameters) => [game.chatCommands.createInfoElement("Enter a message.")],
        closeOnComplete: true
    });