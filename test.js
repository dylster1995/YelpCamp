// let add = (x,y,doNext, noWait) => {
//     console.log (x+y)

//     // limit results
//     if(x > 0 && y > 0){
//         doNext && doNext(x-1,y-1, doNext)
//     }
// }
   
// add(9,9, add) //passing the function definition of the add function       
// console.log("\n\n");
  
//  add(9,9,() => {            //Right
//    return add(8,8, () => {
//      return add(7,7)
//    })
//  })

//  function strange(a,b){
//     console.log(a+b);
//  }
//  function strange(a,b,c) {
//     console.log(a+b+c);
//  }
//  strange(2,3);

//anonymous function
let example = (message, callback = () => { console.log("I'm the callback!") } ) => {
    console.log(message);
    callback();
 }
example("Hello world!");
example("Hello World", () => { console.log("Custom callback") });

//  example(1,2, () => {
//     console.log("I will happen last.");
//  })

// let add = (x,y,doNext) => {
//     console.log (x+y)
//    doNext && doNext()
//  }

// add(9,9,() => {            //Right
//     add(8,8, () => {
//         add(7,7)
//     })
//   })

//   console.log(add.toString())