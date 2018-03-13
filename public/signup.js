$(document).ready(()=>{
  $('#signupButton').on('click',(event)=>{
    event.preventDefault();
    if(valid()){
      return $.ajax('/api/users', {
        method: 'POST',
        data: {
          firstName: $('#firstName').val(),
          lastName: $('#lastName').val(),
          email: $('#email').val(),
          password: $('#password').val(),
        }
      })
      .then((response)=>{
        console.log(response);
      });
    }else{
      console.log('its not valid');
    }
  });
});

function valid(){
  let valid = true;
  //check if passwords match
  if($('#password').val() !== $('#password').val()){
      console.error('passwords do not match');
      $('#password').addClass('is-invalid');
      $('#confirm-password').addClass('is-invalid');
      valid = false;
  }


  // check if all fields are filled
  $('.required').each((index, control)=>{
    let $control = $(control);
    let $input = $($(control).children()[0]);
    if ($input.val().length === 0){
      console.error($input.attr('id')+' cannot be blank')
      $input.addClass('is-invalid');
      valid = false;
    }else{
      $input.removeClass('is-invalid');
    }
  });

  //check if email is valid format
  if (!validateEmail()){
    console.error('invalid email format');
    $('#email').addClass('is-invalid');
    valid = false;
  }else{
    $('#email').removeClass('is-invalid');
  }




  return valid;
}

function validateEmail() {
  let email = $('#email').val();
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}
