let tag;
const wordOne = "coronavirus";
// const wordTwo = myArgs[1];
const neatCsv = require('neat-csv');
const fs = require('fs')
const trends = {}
// const path = `./${wordOne}-world`
const path = `./Coronavirus`
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
    }
}
fs.readdir(path, function (err, items) {
    if (err) {
        console.log("cannot open directory");
    }
    const start = async () => {
        await asyncForEach(items, async (item) => {
            if (item[0] !== "." && item.indexOf("csv") !== -1)
                await process1file(item);
        })

    };
    start().then(
        () => {
            // console.log(JSON.stringify(trends, null, 4))
            fs.writeFileSync(`./coronavirus-by-country.json`,
                JSON.stringify(trends, null, 4)) //name of output file
            console.log('complete');
        }
    )
})
async function process1file(fileName) {
    let data = fs.readFileSync(`${path}/${fileName}`);
    const pairs = await neatCsv(data)
    pairs.shift()
    let chunks = pairs[0][1].split(/\(/)
    let pieces = chunks[1].split(/\//).map(v => {
        if (+v < 10) return "0" +v
        return v
    })
    tag = pieces[0] + "-" +pieces[1]
    pairs.shift()
    pairs.forEach(
        datum => {
            const country = datum[0]
            const val1 = cleanData(datum[1])
            // console.log(country, val1);

            // console.log({country, val1, val2}) 
            if (trends[country] === undefined) {
                trends[country] = {}
            }
            trends[country][tag] = val1
        }
    )
}


function cleanData(str) {
    if (str === '' || str[0] === '<') return 0
    str = str.replace('%', '')
    const val = parseInt(str)
    if (val === NaN) console.log(str)
    return val / 100
}

