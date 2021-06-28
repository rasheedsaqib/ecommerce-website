exports.generateRandomString = (length)=>{
    var allCharacters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
    var randString = '';
    for(var i=0; i<length; i++){
        randString = randString + allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }
    return randString;
}

exports.randomInt = (min, max)=>{
    return (Math.floor(Math.random() * (max-min)) + min);
}