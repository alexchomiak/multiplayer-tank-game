let c = {}
function init() {
    //while(!socket.connected){}
        c = new Connection(io.connect('http://localhost:9999'))
        death = false
        draw()  
}





//modal functioms
$(window).load(()=>{
    $('#loginModal').modal({backdrop: 'static', keyboard: false})
})

$('.name-form').submit((event)=>{
    event.preventDefault()
    // console.log("Submitted!")
    name = document.querySelector('#name-input').value;
    $('#loginModal').modal('hide')
    $('.hiddenOnStart').removeAttr('hidden');
    init()
})
