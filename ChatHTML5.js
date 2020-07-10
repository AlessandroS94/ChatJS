// JavaScript Document
//Required <link rel="stylesheet" href="dist/css/adminlte.min.css">
//Required <link rel="stylesheet" href="dist/css/adminlte.min.css">
//Required <link rel="stylesheet" href="plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
//Required <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
//Required <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">


class ChatHTML5 {
    constructor(userAuth, path, csrf, outputRef, asset) {

        this.path = path;
        this.userAuth = userAuth;
        $.ajax({
            url: path,
            success: function (data) {
                this.cardFooter = new cardFooter(outputRef, csrf).get();
                this.section = document.getElementById("chatHTML5");
                this.cardTitle = new cardTitle("Chat").get();
                this.card = document.createElement("div");
                this.card.className = "card direct-chat direct-chat-primary";
                this.container = document.createElement("div");
                this.container.className = 'container-fluid';
                this.cardBody = new cardBody(data, userAuth, asset).get();
                this.card.appendChild(this.cardTitle);
                this.card.appendChild(this.cardBody);
                this.card.appendChild(this.cardFooter);
                this.container.appendChild(this.card);
                this.section.appendChild(this.container);

            },
            error: function (richiesta, stato, errori) {
                alert("E' evvenuto un errore. Lo stato della chiamata: " + stato);
            }
        });
        setInterval(updateCardBody, 30000, path, userAuth, asset);
    }
}

/**********************************************+
 *
 * start title card with component
 */
class cardTitle {
    constructor(text) {
        this.title = document.createElement("h3");
        this.title.className = 'card-title';
        this.title.innerHTML = text;
        this.divContainer = document.createElement("div");
        this.divContainer.className = 'card-header';
        this.divContainer.appendChild(this.title);
    }

    get() {
        return this.divContainer;
    }
}

/**********************************************+
 *
 * start body card with component
 */
class cardBody {
    constructor(data, userId, asset) {

        this.cardBody = document.createElement("div");
        this.cardBody.className = "card-body";
        this.cardBody.setAttribute('id', 'messages');

        this.divContainer = new messages(data, userId, asset).get();
        this.cardBody.appendChild(this.divContainer);
    }

    get() {
        return this.cardBody;
    }
}

class messages {

    constructor(data, userId, asset) {
        this.divContainer = document.createElement("div");
        this.divContainer.className = 'direct-chat-messages';
        this.divContainer.style = 'height: 400px';
        {
            data.forEach(a => {
                    if (a.pivot.body != "START") {
                        let msg = new message(a, userId, asset);
                        this.divContainer.appendChild(msg.get());
                    }
                }
            );
        }

    }

    get() {
        return this.divContainer;
    }
}

/**********************************************+
 *
 * start footer card with component
 */
class cardFooter {
    constructor(url, csrf) {
        this.container = document.createElement("div");
        this.container.className = 'card-footer';
        this.form = document.createElement("form");
        this.form.setAttribute('id', "chat");
        this.form.setAttribute('method', "post");
        this.form.setAttribute('enctype', "multipart/form-data")
        this.form.setAttribute('action', url);
        this.inputCsrf = document.createElement("input");
        this.inputCsrf.type = "hidden";
        this.inputCsrf.name = "_token";
        this.inputCsrf.value = csrf;
        this.inputGroup = document.createElement("div");
        this.inputGroup.className = "input-group";
        this.input = document.createElement('input');
        this.input.className = "form-control";
        this.input.type = "text";
        this.input.name = "message";
        this.button = document.createElement('button');
        this.button.className = "btn btn-primary";
        this.button.type = "submit";
        this.button.innerHTML = "Invia";
        this.inputGroup.appendChild(this.inputCsrf);
        this.inputGroup.appendChild(this.input);
        this.attach = new Attachment();
        this.inputGroup.appendChild(this.attach.get());
        this.inputGroup.appendChild(this.button);
        this.form.appendChild(this.inputGroup);
        this.container.appendChild(this.form);
    }

    get() {
        return this.container;
    }
}

/**********************************************+
 *
 * start footer card with component
 */
class Attachment {
    constructor() {
        this.attachment = document.createElement("div");
        this.attachment.className = "btn btn-default btn-file";
        this.icon = document.createElement("i");
        this.icon.className = "fas fa-paperclip";
        this.input = document.createElement("input");
        this.input.type = "file";
        this.input.name = "attachment";
        this.attachment.appendChild(this.input);
        this.attachment.appendChild(this.icon);
    }

    get() {
        return this.attachment;
    }
}

/**********************************************+
 *
 * start message
 */
class message {
    constructor(msg, userId, asset) {
        this.container = document.createElement("div");
        if (msg.id == userId)
            this.container.className = "direct-chat-msg right";
        else
            this.container.className = "direct-chat-msg";
        this.info = document.createElement("div");
        this.info.className = "direct-chat-infos clearfix";
        this.span1 = document.createElement("span");
        this.span1.className = "direct-chat-name float-left";
        this.span1.innerHTML = msg.name_user;
        this.span2 = document.createElement("span");
        this.span2.className = "direct-chat-timestamp float-right";
        this.span2.innerHTML = msg.pivot.created_at;
        this.icon = document.createElement('i');
        this.icon.className = 'direct-chat-img fa fa-user fa-2x';
        this.text = document.createElement('div');
        this.text.className = "direct-chat-text";
        this.text.innerHTML = msg.pivot.body;
        if (msg.pivot.path) {
            this.href = document.createElement("a");
            this.href.className = "btn bg-info";
            this.href.setAttribute("href", asset + msg.pivot.path);
            this.href.innerHTML = "Visualizza File";
            this.br = document.createElement("br");
            this.text.appendChild(this.br);
            this.text.appendChild(this.href);
        }
        this.info.appendChild(this.span1);
        this.info.appendChild(this.span2);
        this.container.appendChild(this.info);
        this.container.appendChild(this.icon);
        this.container.appendChild(this.text);
    }

    get() {
        return this.container;
    }
}

function updateCardBody(path, Auth, asset) {
    $.ajax({
        url: path,
        success: function (data) {
            let cardBody = document.getElementById("messages");
            cardBody.lastChild.remove();
            let M = new messages(data, Auth, asset).get();
            cardBody.appendChild(M);
        }
    });
}
