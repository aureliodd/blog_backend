

Se si fa una XMLhttpRequest ad una pagina differente da quella in cui ci si trova, il browser la blocca automaticamente per motivi di sicurezza queste richieste, a meno che nella pagina "principale" del server non si scriva:

app.use(function (req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
}