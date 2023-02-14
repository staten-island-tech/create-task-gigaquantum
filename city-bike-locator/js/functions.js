const apiFunctions = {
  fetchAPI: async function (url) {
    try {
      const response = await fetch(url);
      if (response.status < 200 || response.status > 299) {
        console.log(response.status);
        throw Error(response.status);
      } else {
        const jsonData = await response.json();
        return await jsonData;
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
};

export { apiFunctions };
