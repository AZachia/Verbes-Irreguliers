function xor_crypt(message, cle) {
    var message_code = '';
    for (let i = 0; i < message.length; i++) {
        message_code += String.fromCharCode(message.charCodeAt(i) ^ cle.charCodeAt(i % cle.length));
    }
    return message_code;
}