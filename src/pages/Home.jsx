import { useState, useMemo, useEffect } from "react";
import image from "../assets/Weather-cuate.svg";
import Loader from "../components/Loader";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeoCode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const PlacesAutocomplete = ({ setSelected }) => {
  const res = usePlacesAutocomplete();
  console.log(res);

  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => {
            console.log("changed");
            setValue(e.target.value, true);
          }}
          placeholder="Enter a location"
          className="search-input"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </>
  );
};

const Map = () => {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div>
        <PlacesAutocomplete setSelected={setSelected} />
        <h2>HELLO</h2>
      </div>
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  );
};

const Home = () => {
  // const google = window.google;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libaries: ["places"],
  });

  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("hello", location);
  };

  if (!isLoaded)
    return (
      <div>
        Loading... <Loader />
      </div>
    );

  return (
    <div className="w-container flex flex-1 justify-between">
      <div className="content w-2/3 flex justify-center ">
        <div className="w-4/5">
          <h1 className="text-3xl font-bold mb-5 text-center">
            What's the weather in...
          </h1>
          <div className="relative">
            {/* <form onSubmit={handleSubmit}> */}
            <label>Location:</label>
            <div className="flex items-center">
              {/* <input
                type="text"
                required
                placeholder="Enter a location"
                className="search-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              /> */}
              <PlacesAutocomplete setSelected={setSelected} />

              <button>Search</button>
            </div>
            {/* </form> */}
          </div>
          <div className="weather-details">
            <img className="h-full w-full" src={image} alt="" />
          </div>
          {/* <h2>Find out the weather in</h2> */}
          {/* <Loader /> */}
          <p className="mt-5">
            Made with <span>❤</span> by Lani Billions
          </p>
        </div>
      </div>

      <div className="map w-1/3">
        <Map />
      </div>
    </div>
  );
};

export default Home;
