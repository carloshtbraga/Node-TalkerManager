function filterTalkers(talkers, searchTerm, rateParam) {
    let filteredTalkers = talkers;  
    if (searchTerm) {
      filteredTalkers = filteredTalkers.filter((t) => t.name.includes(searchTerm));
    }  
    if (rateParam) {
      filteredTalkers = filteredTalkers.filter((t) => t.talk.rate === Number(rateParam));
    }  
    return filteredTalkers;
  }

module.exports = filterTalkers;