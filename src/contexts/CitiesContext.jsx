import {useCallback, useRef, useState} from "react";
import {useReducer} from "react";
import {createContext, useContext, useEffect} from "react";

const CitiesContext = createContext();
const BASE_URL = "https://json-server-u9n3.vercel.app";
// const BASE_URL = "http://localhost:8000";

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: "",
	//  quick fix
	currentCities: [],
};
function reducer(state, action) {
	console.log(state.currentCities);
	switch (action.type) {
		case "loading":
			return {...state, isLoading: true};
		case "cities/loaded":
			return {
				...state,
				isLoading: false,
				cities: action.payload,
				currentCities: action.payload,
			};
		case "city/loaded":
			return {...state, isLoading: false, currentCity: action.payload};
		case "city/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		//temp fix json server
		case "fakeCities/loaded":
			return {...state, currentCities: action.payload};
		case "fakeCity/created":
			return {
				...state,
				currentCities: [...state.currentCities, action.payload],
				currentCity: action.payload,
			};
		case "fakeCity/deleted":
			return {
				...state,
				currentCities: state.currentCities.filter(
					(city) => city.id !== action.payload
				),
				currentCity: {},
			};
		//
		case "city/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: {},
			};
		case "rejected":
			return {...state, isLoading: false, error: action.payload};
		default:
			throw new Error("Unknown action type");
	}
}
function CitiesProvider({children}) {
	const [{cities, isLoading, currentCity, error, currentCities}, dispatch] =
		useReducer(reducer, initialState);
	// const [cities, setCities] = useState([]);
	// const [isLoading, setisLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState('');

	// quick fix for vercel server json

	useEffect(function () {
		async function fetchCities() {
			dispatch({type: "loading"});
			dispatch({type: "fakeCities/loaded", payload: currentCities});

			try {
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				dispatch({type: "cities/loaded", payload: data});
			} catch {
				dispatch({
					type: "rejected",
					payload: "There was an error loading cities...",
				});
			}
		}
		fetchCities();
	}, []);
	const getCity = useCallback(
		async function getCity(id) {
			if (Number(id) === currentCity.id) return;
			dispatch({type: "loading"});
			try {
				const res = await fetch(`${BASE_URL}/cities/${id}`);
				const data = await res.json();
				dispatch({type: "city/loaded", payload: data});
			} catch {
				dispatch({
					type: "rejected",
					payload: "There was an error loading city...",
				});
			}
		},
		[currentCity.id]
	);
	async function createCity(newCity) {
		dispatch({type: "loading"});
		dispatch({type: "fakeCity/created", payload: newCity});
		try {
			const res = await fetch(`${BASE_URL}/cities`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			dispatch({type: "city/created", payload: data});
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error creating the cities...",
			});
		}
	}
	async function deleteCity(id) {
		dispatch({type: "loading"});
		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});

			dispatch({type: "fakeCity/deleted", payload: id});
			dispatch({type: "city/deleted", payload: id});
		} catch {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the city...",
			});
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity,
				error,
				currentCities,
			}}>
			{children}
		</CitiesContext.Provider>
	);
}
function useCities() {
	const context = useContext(CitiesContext);
	return context;
}
export {CitiesProvider, useCities};
