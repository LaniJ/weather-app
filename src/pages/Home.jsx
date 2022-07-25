import { useState, useMemo, useEffect } from "react";
import image from "../assets/Weather-cuate.svg";
import Loader from "../components/Loader";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
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
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect} className="grow">
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
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
  );
};

const Map = ({ selected }) => {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <div>
      <GoogleMap
        zoom={10}
        center={selected}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  );
};

const Home = () => {
  // const google = window.google;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    id: "google-map-script",
  });
  console.log("isLoaded", isLoaded);

  const [location, setLocation] = useState({ lat: 43.45, lng: -80.49 });
  const [selected, setSelected] = useState();

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
            <label>Location:</label>
            <div className="flex items-center">
              <PlacesAutocomplete setSelected={setSelected} />
              <button onClick={() => setLocation(selected)}>Search</button>
            </div>
          </div>
          <div className="weather-details">
            <img className="h-full w-full" src={image} alt="" />
          </div>
          <p className="mt-5">
            Made with <span>❤</span> by Lani Billions
          </p>
        </div>
      </div>

      <div className="map w-1/3">
        <Map selected={location} />
      </div>
    </div>
  );
};

export default Home;
