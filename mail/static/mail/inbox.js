document.addEventListener('DOMContentLoaded', function() {

// Use buttons to toggle between views
document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
document.querySelector('#compose').addEventListener('click', compose_email);
// document.querySelector('#compose-form').addEventListener('submit', send_email);

// By default, load the inbox
load_mailbox('inbox');

// document.querySelectorAll('button').forEach(button => {
//     button.onclick = function() {
//         const page = this.innerHTML;

//         if (page != "Send" || page != 'Logout') {
//           // Add the current state to the history
//           history.pushState({section: page}, "", `${page}`);
//         }

//     };
// });

});

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#mailbox').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    var emails_list = document.querySelector('#emails-list')
    while (emails_list.children.length > 1) {
        emails_list.removeChild(emails_list.lastChild);
    }

    // Request data
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        // Print emails
        emails.forEach((email) => {
            var is_read = email.read
            var sender = email.sender
            var subject = email.subject
            var timestamp = email.timestamp

            show_mail(is_read, sender, subject, timestamp)
        });

        // ... do something else with emails ...
    });

}

function send_email() {
    var recipients = document.querySelector('#compose-recipients').value
    var subject = document.querySelector('#compose-subject').value
    var body = document.querySelector('#compose-body').value

    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent')
    })

}

function show_mail(is_read, sender, subject, timestamp) {
    var original = document.getElementById('mail')
    var clone = original.cloneNode(true)
    clone.style.display = "flex"
    var senderelement = clone.children[0].children[0]
    var subjectelement = clone.children[0].children[1]
    var timestampelement = clone.children[1]
    senderelement.innerHTML = sender
    subjectelement.innerHTML = subject
    timestampelement.innerHTML = timestamp

    if (is_read) {
        clone.classList.add('list-group-item-secondary')
    }

    original.parentNode.appendChild(clone)
}