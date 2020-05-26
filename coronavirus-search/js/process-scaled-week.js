const convertMapsToObjects = (mapInstance) => {  
    const obj = {};  
    for(let prop of mapInstance){    
        obj[prop[0]] = prop[1];  } 
        return obj;}

const wordOne = "coronavirus";
// const wordTwo = myArgs[1];
const neatCsv = require('neat-csv');
const fs = require('fs')
const scaledInterest = new Map()
const path = `./${wordOne}.csv`

process1file(path).then(
    () => {
        let json = convertMapsToObjects(scaledInterest)
        let result = {"coronavirus": json}
        console.log(JSON.stringify(result, null, 4))
    }
);

// fs.writeFileSync(`./resources/results/${wordOne}.json`,
//     JSON.stringify(trends, null, 4)) //name of output file
// console.log('complete');

async function process1file(path) {

    let data = fs.readFileSync(path);
    const pairs = await neatCsv(data)
    // console.log(pairs);
    pairs.shift()
    pairs.shift()
    let denom = 0;
    let tag;
    let val1;
    pairs.forEach(
        (datum, index) => {

            const mo = datum[0].substring(5, 7)
            const dy = datum[0].substring(8)

            if (index % 7 === 0) {
                tag = mo + "-" + dy
                denom = 1
            } else {
                denom++
            }
            if (datum[1] === "<1") {
                val1 = 0
            } else {
                val1 = +datum[1]
            }
            if (scaledInterest.has(tag)) {

                scaledInterest.set(tag, scaledInterest.get(tag) + val1 / 7)
            }
            else {
                scaledInterest.set(tag, val1 / 7)
            }
            // console.log(scaledInterest);
        }
    )
    if (denom !== 7)
        scaledInterest.set(tag, scaledInterest.get(tag) * 7 / denom)
}