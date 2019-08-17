function Genetic() {

    this.generation = 1;
    this.genomes = [];
    this.fitness = 0;
    this.numeroGenomas = 0;

}

Genetic.prototype.createGenomes = function (numGenomes, inputs, outputs) {

    this.numeroGenomas = numGenomes;

    for (let i = 0; i < this.numeroGenomas; i++) {
        var genome = new synaptic.Architect.Perceptron(inputs, 10, outputs);
        genome.fitness = 0;

        this.genomes.push(genome);
    }
}

Genetic.prototype.activateNetwork = function (networkIndex, input) {
    return this.genomes[networkIndex].activate(input);
}

Genetic.prototype.prepareCrossOver = function () {

    this.generation++;

    this.genomes = this.selectBestGenomes(5);

    var bestGenomes = JSON.parse(JSON.stringify(this.genomes));

    while (this.genomes.length < (this.numeroGenomas - Math.round(this.numeroGenomas / 2))) {
        var genA = bestGenomes[Math.floor(Math.random() * bestGenomes.length)];
        var genB = bestGenomes[Math.floor(Math.random() * bestGenomes.length)];

        var newGenome = this.mutate(this.crossOver(genA, genB));

        this.genomes.push(synaptic.Network.fromJSON(newGenome));
    }

    while (this.genomes.length < this.numeroGenomas) {
        var gen = bestGenomes[Math.floor(Math.random() * bestGenomes.length)];

        var newGenome = this.mutate(gen);

        this.genomes.push(synaptic.Network.fromJSON(newGenome));
    }
}

Genetic.prototype.selectBestGenomes = function (selectN) {

    let ordered = this.genomes.sort(function (a, b) {
        return b.fitness - a.fitness;
    });

    return ordered.splice(0, selectN);
}

Genetic.prototype.crossOver = function (networkA, networkB) {

    // 50% prob.
    if (Math.random() > 0.5) {
        var tmp = networkA;
        networkA = networkB;
        networkB = tmp;
    }

    networkA = JSON.parse(JSON.stringify(networkA));
    networkB = JSON.parse(JSON.stringify(networkB));

    this.crossOverDataKey(networkA.neurons, networkB.neurons, 'bias');

    return networkA;
}

Genetic.prototype.crossOverDataKey = function (a, b, key) {

    var cutLocation = Math.round(a.length * Math.random());

    var tmp;
    for (var k = cutLocation; k < a.length; k++) {
        // Swap
        tmp = a[k][key];
        a[k][key] = b[k][key];
        b[k][key] = tmp;
    }
}

Genetic.prototype.mutate = function (network) {

    this.mutateDataKeys(network.neurons, 'bias', 0.3);

    this.mutateDataKeys(network.connections, 'weight', 0.3);

    return network;
}

Genetic.prototype.mutateDataKeys = function (a, key, mutationRate) {
    for (var k = 0; k < a.length; k++) {

        if (Math.random() > mutationRate)
            continue;

        a[k][key] += a[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
    }
}

Genetic.prototype.executeGenome = function (pos, score) {

    if (!this.genomes[pos].fitness || this.genomes[pos].fitness < score)
        this.genomes[pos].fitness = score;

    if (score > this.fitness)
        this.fitness = score;
}
