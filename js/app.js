 // Initialize Firebase
 var config = {
  apiKey: "인증키",
  authDomain: "도메인",
  databaseURL: "데이터베이스 주소",
  projectId: "아이디",
  storageBucket: "midterm-123.appspot.com",
  messagingSenderId: "655217595362"
};
firebase.initializeApp(config);

const txtEmail = document.getElementById("txtEmail");
const txtPass = document.getElementById("txtPassword");
const btnLogin = document.getElementById("btnLogin");
const btnSignUp = document.getElementById("btnSignUp");
const logoutForm = document.getElementById("logoutForm");
const btnLogOut = document.getElementById("btnLogout");
const loginForm = document.getElementById("loginForm");
const welcome = document.getElementById("welcome");
const dataEntry = document.getElementById("dataEntry");
  
var uid=null;


//Add Login Event
btnLogin.addEventListener("click", e=>{
 //Get email and pass
  const auth = firebase.auth();
  const email = txtEmail.value;
  const pass = txtPassword.value;
 //Sign in
 const promise = auth.signInWithEmailAndPassword(email,pass);
  promise.catch (e => console.log(e.message));
});

//Add Signup Event
btnSignUp.addEventListener("click", e=>{
 //Get email and pass
 // TODO: CHECK 4 REAL EMAILS
  const auth = firebase.auth();
  const email = txtEmail.value;
  const pass = txtPassword.value;
 //Sign in
 const promise = auth.createUserWithEmailAndPassword(email,pass);
  promise
    .catch (e => console.log(e.message));
});

btnLogOut.addEventListener('click', e => {
 firebase.auth().signOut();
 location.reload();
 
});


//ADD A REALTIOME LISTENNER
firebase.auth().onAuthStateChanged(firebaseUser => {
 if(firebaseUser) {
   console.log(firebaseUser.uid);     
   uid = firebaseUser.uid;
   console.log(uid);
   logoutForm.classList.remove('hide');
   loginForm.classList.add('hide');
   welcome.classList.add("hide");
   dataEntry.classList.remove("hide");
   document.getElementById("email").innerHTML = firebaseUser.email;
   updateEvents();

 } else {
    console.log('not logged in');
   uid = null;
    logoutForm.classList.add('hide');
   loginForm.classList.remove('hide');
   welcome.classList.remove("hide");
   dataEntry.classList.add("hide");

 }
});


//여기서부터
document.getElementById("save").onclick = function(){
  
 
    var date = document.getElementById("date"); 
    var name = document.getElementById("name"); 
    var age = document.getElementById("age");
    var number = document.getElementById("number");
  
  if(uid == null) return;  
  
   var ref = firebase.database().ref("members/" + uid);
   ref.push().set({
       date: date.value,
       name: name.value,
       age: age.value,
       number: number.value,
  
   });
   
   date.value="";
   name.value="";
   age.value="";
   number.value="";  
  }
  
 var refEmp = null;
 
  function updateEvents(){

    if(uid == null ) return;

  refEmp  = firebase.database().ref("members").child(uid);
 refEmp.on('child_added', snap=>{
    var empList = document.getElementById("empList");
    const tr = document.createElement("tr");
    tr.id=snap.key;
    tr.innerHTML = "<td>"+ snap.child("date").val() + "</td><td>" + snap.child("name").val() + "</td><td>" + snap.child("age").val() + "</td><td>" + snap.child("number").val() + "</td><td><a href='#' onclick='deleteRec(this)'>Delete</a></td>";
    empList.appendChild(tr);
 });
  
  refEmp.on('child_removed',snap=>{ 
    const liRemoved = document.getElementById(snap.key);
    liRemoved.remove();
  });
  refEmp.on('child_changed',snap=>{
    const td = document.getElementById(snap.key);
    td.innerText = snap.child("name").val() + snap.child("age").val();
  });
 
 }

  function deleteRec(o){
   if(uid == null ) return;
    //alert(o.parentNode.parentNode.id);
    var ref = firebase.database().ref("members/"+ uid + "/" + o.parentNode.parentNode.id);
    ref.remove();
  
  }


