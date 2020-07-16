// JavaScript Document
//Required <link rel="stylesheet" href="dist/css/adminlte.min.css">
//Required <link rel="stylesheet" href="dist/css/adminlte.min.css">
//Required <link rel="stylesheet" href="plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
//Required <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
//Required <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.3.0/jquery.form.min.js" integrity="sha384-qlmct0AOBiA2VPZkMY3+2WqkHtIQ9lSdAsAn5RUJD/3vA5MKDgSGcdmIv4ycVxyn" crossorigin="anonymous"></script>

/**********************************************
 * Create element for Chat
 */
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

/**********************************************
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
        this.form.setAttribute('name', 'chat');
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
        this.input.setAttribute('maxlength', 200);
        this.input.type = "text";
        this.input.name = "message";
        this.button = document.createElement('button');
        this.button.className = "btn btn-primary";
        this.button.type = "button";
        this.button.onclick = validator();
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
        this.input.setAttribute("id", "attachment");
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

/*******************************************************
 *
 Function to update the messaage with result of ajax call
 */
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

/********************************************************
 *
 Function to check the input
 */
function validator() {
    let message = document.forms(['chat']['message']).value;
    let file = document.forms(['chat']['attachment']).value;
    var filePath = file.value;
    let extension = /(\.jpg|\.jpeg|\.png|\.pdf|\.tiff|\.psd|\.bmp|\.gif)$/i;
    let section = document.getElementById("chatHTML5");


    if (message.length > 200) {
        let avviso1 = new avviso("Messaggio troppo lungo");
        section.appendChild(avviso1.get());
        return false;
    }

    if (file.length >= 1 && !extension.exec(filePath)) {
        let avviso1 = new avviso("Estensione file non valida");
        section.appendChild(avviso1.get());
        file.value = '';
        return false;
    }

    if (file.length > 4096) {
        let avviso1 = new avviso("File d'immagine troppo grande! Inserire inferiore ai 4 MB");
        section.appendChild(avviso1.get());
        return false;
    }

    if (message.length == 0 && file.length == '') {
        let avviso1 = new avviso("Messaggio vuoto! Inserisci un file d'immagine o scrivi un messaggio");
        section.appendChild(avviso1.get());
        return false;
    }

    return true;

}

/*********************************************************
 * Function to send message
 */

function send() {
    if (validator()) {
        $("#chat").submit(function (event) {
            event.preventDefault();
            let post_url = $(this).attr("action");
            let request_method = $(this).attr("method");
            var form_data = $(this).serialize();
            let showModal = new modal();
            document.getElementById("chatHTML5").appendChild(showModal.get());

            if ($('#attachment').val()) {
                $(this).ajaxSubmit({
                    uploadProgress: function (event, position, total, percentComplete) {
                        document.getElementById("bar").style.width = percentComplete + "%";
                    },
                    success: function () {
                        document.getElementById("bar").style.width = 100 + "%";
                    },
                    error: function () {
                        let message = new modalWarning();
                        document.getElementById("chatHTML5").appendChild(message.get());
                    },
                });
            } else {
                $.ajax({
                    url: post_url,
                    type: request_method,
                    data: form_data,
                    success: function (data) {
                        document.getElementById("bar").style.width = "100%";
                    },
                    error: function () {
                        let message = new modalWarning();
                        document.getElementById("chatHTML5").appendChild(message.get());
                    },
                });
            }
        }
    }
}

/*********************************************************
 *
 Allert view with message
 */

class avviso {
    constructor(message) {
        this.div = document.createElement("div");
        this.div.className = "toasts-top-right fixed";
        this.div.setAttribute("id", "toastsContainerTopRight");
        this.div2 = document.createElement("div");
        this.div2.className = "toast bg-info fade";
        this.div2.setAttribute("role", "assertive");
        this.div2.setAttribute("aria - live", "assertive");
        this.div2.setAttribute("aria - atomic", "true");
        this.div3.createElement("div");
        this.div3.className = "toast-header";
        this.strong = document.createElement("strong");
        this.strong.className = "mr-auto";
        this.strong.innerHTML = "ALLERT";
        this.button = document.createElement("button");
        this.button.setAttribute("data - dismiss", "toast");
        this.button.setAttribute("type", "button");
        this.button.className = "ml-2 mb-1 close";
        this.button.setAttribute("aria - label", "Close");
        this.span = document.createElement("span");
        this.span.setAttribute("aria - hidden", "true");
        this.span.innerHTML = "x";
        this.button.appendChild(this.span);
        this.div3.appendChild(this.strong);
        this.div3.appendChild(this.button);
        this.div4 = document.createElement("div");
        this.div4.className = "toast-body";
        this.div4.innerHTML = message;
        this.div2.appendChild(this.div3);
        this.div2.appendChild(this.div3);
        this.div.appendChild(this.div2);
    }

    get() {
        return this.div;
    }
}

/*********************************************************
 *
 Modal updaload view with message
 */

class modal {
    constructor() {
        this.div = document.createElement("div");
        this.div.className = "modal fade";
        this.div.setAttribute("id", "modal-info");
        this.div2 = document.createElement("div");
        this.div2.className = "modal-dialog";
        this.div3 = document.createElement("div");
        this.div3.className = "modal-content bg-info";
        this.header = new modalHeader();
        this.body = new modalBody();
        this.div3.appendChild(this.header);
        this.div3.appendChild(this.body);
        this.div2.appendChild(this.div3);
        this.div.appendChild(this.div2);
    }

    get() {
        return this.div;
    }
}

class modalHeader {
    constructor() {
        this.div = document.createElement("div");
        this.div.className = "modal-header";
        this.h4 = document.createElement("h4");
        this.h4.className = "modal-title";
        this.h4.innerHTML = "Caricamento";
        this.div.appendChild(this.h4);
        this.button = document.createElement("button");
        this.button.className = "close";
        this.button.setAttribute("type", "button");
        this.button.setAttribute("data-dismiss", "modal");
        this.button.setAttribute("aria-label", "Close");
        this.span = document.createElement("span");
        this.span.setAttribute("aria-hidden", "true");
        this.span.innerHTML = "&times;";
        this.button.appendChild(this.span);
        this.div.appendChild(this.button);
    }

    get() {
        return this.div;
    }
}

class modalBody {
    constructor() {
        this.div = document.createElement("div");
        this.div.className = "modal-body";
        this.div2 = document.createElement("div");
        this.div2.className = "progress progress-sm";
        this.div3 = document.createElement("div");
        this.div3.className = "progress-bar bg-primary";
        this.div3.setAttribute("id", "bar");
        this.div3.setAttribute("style", "width: 20%");
        this.div2.appendChild(this.div3);
        this.div.appendChild(this.div2);
    }

    get() {
        return this.div;
    }
}

/*********************************************************
 *
 Modal with error
 */

class modalWarning {
    constructor() {
        this.div = document.createElement("div");
        this.div.className = "modal fade";
        this.div.setAttribute("id", "modal-info");
        this.div2 = document.createElement("div");
        this.div2.className = "modal-dialog";
        this.div3 = document.createElement("div");
        this.div3.className = "modal-content bg-warning";
        this.header = new modalHeader();
        this.body = new modalBody();
        this.div3.appendChild(this.header);
        this.div3.appendChild(this.body);
        this.div2.appendChild(this.div3);
        this.div.appendChild(this.div2);
    }

    get() {
        return this.div;
    }
}

class modalHeaderWarning {
    constructor() {
        this.div = document.createElement("div");
        this.div.className = "modal-header";
        this.h4 = document.createElement("h4");
        this.h4.className = "modal-title";
        this.h4.innerHTML = "Caricamento";
        this.div.appendChild(this.h4);
        this.button = document.createElement("button");
        this.button.className = "close";
        this.button.setAttribute("type", "button");
        this.button.setAttribute("data-dismiss", "modal");
        this.button.setAttribute("aria-label", "Close");
        this.span = document.createElement("span");
        this.span.setAttribute("aria-hidden", "true");
        this.span.innerHTML = "&times;";
        this.button.appendChild(this.span);
        this.div.appendChild(this.button);
    }

    get() {
        return this.div;
    }
}

class modalBodyWarning {
    constructor() {
        this.div = document.createElement("div");
        this.div.className = "modal-body";
        this.p = document.createElement("p");
        this.p.innerHTML = "ERRORE! RIPROVA";
        this.div.appendChild(p);

    }

    get() {
        return this.div;
    }
}
