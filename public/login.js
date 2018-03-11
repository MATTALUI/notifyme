$(document).ready(()=>{
  $('#loginButton').on('click',(event)=>{
    event.preventDefault();
    let email = $('#email').val();
    let password = $('#password').val();
    let body = {email, password};
    console.log(body);
  });
});
