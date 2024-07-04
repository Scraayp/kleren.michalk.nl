export default async function Home() {
  let location = "Amsterdam";
  let getWeather = async () => {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key= ${process.env.API_KEY} &q=${location}&aqi=no`
    );
    const data = await response.json();
    return data;
  };

  const weather = await getWeather();

  let getClothes = async () => {
    if (weather.current.temp_c > 20) {
      return "Korte broek en t-shirt";
    } else {
      return "Lange broek en trui";
    }
  };

  // function changeLocation() {
  //   let newLocation = document.getElementById("locationInput")!.value;
  //   if (newLocation === "") return;
  //   location = newLocation;
  //   getWeather();
  // }

  return (
    <main className="">
      <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-black dark:text-white">
            Welke kleren zou ik aandoen?
          </h1>
          <h2 className="text-center dark:text-white text-2xl">
            Gebaseerd op: {location}
          </h2>
        </div>
        <div>
          <p className="text-black dark:text-white text-xl font-bold text-center">
            Temperatuur op dit moment:{" "}
            <span className="font-normal">{weather.current.temp_c} °C</span>
          </p>
          <p className="text-black dark:text-white text-xl font-bold text-center">
            Voelt als:{" "}
            <span className="font-normal">
              {weather.current.feelslike_c} °C
            </span>
          </p>
          <p className="text-black dark:text-white text-xl font-bold text-center">
            Weersomstandigheden:{" "}
            <span className="font-normal">
              {weather.current.condition.text}
            </span>
          </p>

          <p className="text-black dark:text-white text-xl font-bold text-center mt-20">
            Kleren:
            <br />
            <span className="font-normal">{getClothes()}</span>
          </p>
          {/* <div id="locationChooser">
            <input
              type="text"
              id="locationInput"
              className="border-2 border-black dark:border-white p-2 mt-4"
            />
            <button
              onClick={changeLocation}
              className="bg-black dark:bg-white text-white dark:text-black p-2 mt-4"
            >
              Verander locatie
            </button>
          </div> */}
          {/* 1 */}
        </div>
      </section>
    </main>
  );
}
