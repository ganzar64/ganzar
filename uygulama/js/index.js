var firebaseConfig = {
    apiKey: "AIzaSyCVgAadMrylYc30-4E5gOZ7dwhU4Evx2_c",
    authDomain: "nodejsproject-18a16.firebaseapp.com",
    projectId: "nodejsproject-18a16",
    storageBucket: "nodejsproject-18a16.appspot.com",
    messagingSenderId: "44188710896",
    appId: "1:44188710896:web:6521d820149ba2b1e4cf35"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  firebase.auth.Auth.Persistence.NONE



  $("#btn-login").click(function(){


    var email= $("#email").val();
    var password= $("#password").val();

    if(email !="" && password !=""){

        var result=firebase.auth().signInWithEmailAndPassword(email, password);

        result.catch(function(error){
            var errorcode=error.code;
            var errormessage=error.message;
            console.log(errorcode);
            console.log(errormessage);
            window.alert("Message :", errormessage);
        })
    }
    else{
        window.alert("Form tamamlanamadı")
    }


  });

  $("#btn-signup").click(function(){


    var email= $("#email").val();
    var password= $("#password").val();
    


    if(email !="" && password !=""){



      var result=firebase.auth().createUserWithEmailAndPassword(email, password);

      result.catch(function(error){
          var errorcode=error.code;
          var errormessage=error.message;
          console.log(errorcode);
          console.log(errormessage);
          window.alert("Message :", errormessage);
      })




        
       

        
    

      
    }
    else{
        window.alert("Form tamamlanamadı")
    }


  });

  $("#btn-logout").click(function(){


    firebase.auth().signOut();
    


  });
