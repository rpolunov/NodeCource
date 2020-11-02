const PORT = process.env.PORT || 3000;
const args = process.argv.slice(2);
const arguments = {};

args.forEach(args => {const[key, value] = args.split('=');
arguments[key.slice(1)] = value;})

module.exports = {
    PORT,
    ENV: arguments.env
}
