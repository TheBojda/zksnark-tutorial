const snarkjs = require("snarkjs");
const fs = require("fs");
const circomlibjs = require("circomlibjs");

(async function () {
    const poseidon = await circomlibjs.buildPoseidon();
    const hash = poseidon.F.toString(poseidon([10]));
    console.log(hash);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve({ in: 10, hash: hash }, "build/poseidon_hasher2_js/poseidon_hasher2.wasm", "circuit_0000_2.zkey");
    console.log(publicSignals);
    console.log(proof);

    const vKey = JSON.parse(fs.readFileSync("verification_key_2.json"));
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

    process.exit(0);
})();