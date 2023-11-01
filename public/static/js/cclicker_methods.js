const COOKIE_NAME = 'cookies'

function begin(){
    var cval = get_cookie(COOKIE_NAME);
    update_display(cval)
}

function increment_update(){
    var cval = parseInt(get_cookie(COOKIE_NAME))
    if(Number.isInteger(cval)){
        cval++;
        set_cookie(COOKIE_NAME,cval)
        update_display(cval)
    }
}

function update_display(cval)
{
    var p_display = document.getElementById('id_display')
    p_display.innerHTML = cval;
    
}

function set_cookie(cookien, cval){
    document.cookie = `${cookien}=${cval};path=/`
}

function get_cookie(cookien){
    var decodedCookie = decodeURIComponent(document.cookie)
    return decodedCookie
    .split('; ')
    .find(row => row.startsWith(`${cookien}=`))
    .split('=')[1];
}

console.log(document.cookie)

begin()
