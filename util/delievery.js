exports.calculateDelieveryCharges = (totalPrice)=>{
    if(totalPrice < 4000){
        return totalPrice * 0.05;
    }
    else{
        return 0;
    }
}