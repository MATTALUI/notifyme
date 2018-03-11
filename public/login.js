$(document).ready(()=>{
  $.get('/api/users/me',(response)=>{
    if(response.email){
      window.location = '/';
    }
  });

  $('#loginButton').on('click',(event)=>{
    event.preventDefault();
    let email = $('#email').val();
    let password = $('#password').val();
    let body = {email, password};
    return $.ajax('/api/users/login', {
      method: 'POST',
      data: body,
    }).then((response)=>{
      if(response.success){
        window.location = '/';
      }
    });
  });
});
