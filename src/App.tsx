import React, { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  weather: { icon: string; description: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  name: string;
  wind: { speed: number };
  visibility: number;
}

export const App: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string | undefined>("");
  const [time, setTime] = useState(new Date());

  const getData = (url: string) => {
    axios.get<WeatherData>(url).then((res) => {
      setData(res.data);
      setIsLoading(false);
    });
  };

  const searchLocation = () => {
    setIsLoading(true);
    getData(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=150f62b265a138bd4842191c9ff14a47`
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchLocation();
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getData(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=150f62b265a138bd4842191c9ff14a47`
      );
    });

    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <div className="shadow-xl p-10 bg-blue-400 rounded-3xl">
        <div className="text-white flex justify-center font-bold text-2xl">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>

        <div className="flex justify-center mt-6">
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onKeyDown={handleKeyDown}
            onChange={(event) => setLocation(event.target.value)}
            className="w-3/4 px-4 py-1 text-lg border border-gray-300 rounded-3xl focus:outline-none"
          />
          <img
            alt="Icon"
            width="40"
            src={`/icons/search.svg`}
            className="ml-2 cursor-pointer"
            onClick={searchLocation}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-8">
            <img
              alt="Icon"
              width="35"
              src={`/icons/loader.svg`}
              className="mr-1"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-4">
            {data?.weather && (
              <img
                alt="Weather Icon"
                src={`/icons/${data.weather[0].icon}.png`}
                className="w-35 h-35"
              />
            )}

            {data?.name && (
              <div className="text-3xl text-white">{data.name}</div>
            )}

            {data?.main && (
              <div className="text-white">
                <div className="capitalize">
                  {Math.round(data.main.temp - 273.15)}°C -{" "}
                  {data?.weather[0].description}
                </div>
              </div>
            )}

            <div className="flex flex-col items-center mt-8 text-xs">
              <div className="flex justify-between w-56">
                {data?.main && (
                  <div className="flex items-center text-white w-24">
                    <img
                      alt="Feels Icon"
                      width="35"
                      src={`/icons/feels.svg`}
                      className="mr-1"
                    />
                    <div className="flex flex-col">
                      <div>{Math.round(data.main.feels_like - 273.15)}°C</div>
                      <div className="w-20">Feels like</div>
                    </div>
                  </div>
                )}
                {data?.main && (
                  <div className="flex items-center text-white w-20 ml-6 ">
                    <img
                      alt="Humidity Icon"
                      width="35"
                      src={`/icons/humidity.svg`}
                      className="mr-1"
                    />
                    <div className="flex flex-col">
                      <div>{data.main.humidity}%</div>
                      <div>Humidity</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between w-56 mt-6">
                {data?.wind && (
                  <div className="flex items-center text-white w-28 ">
                    <img
                      alt="Wind Icon"
                      width="35"
                      src={`/icons/wind.svg`}
                      className="mr-1"
                    />
                    <div className="flex flex-col">
                      <div>{Math.round(data.wind.speed * 1.6)} KM/H</div>
                      <div>Wind speed</div>
                    </div>
                  </div>
                )}
                {data?.visibility && (
                  <div className="flex items-center text-white w-20 ml-6 ">
                    <img
                      alt="Visibility Icon"
                      width="35"
                      src={`/icons/visibility.svg`}
                      className="mr-1"
                    />
                    <div className="flex flex-col">
                      <div>{data.visibility}</div>
                      <div>Visibility</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
