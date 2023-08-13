function addState() {
    let stateObj = { id: "100" };

    window.history.replaceState(stateObj,
        "", "avantokyo.org");
}
addState();