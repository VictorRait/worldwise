import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import {useCities} from "../contexts/CitiesContext";

function CountryList() {
	const {cities, isLoading, currentCities} = useCities();

	const countries = currentCities.reduce((arr, city) => {
		if (!arr.map((el) => el.country).includes(city.country))
			return [...arr, {country: city.country, emoji: city.emoji}];
		else return arr;
	}, []);
	console.log(currentCities, countries);
	if (isLoading) return <Spinner />;
	if (!cities.length)
		return (
			<Message message="Add your first city by clicking on a city on the map" />
		);
	return (
		<ul className={styles.countryList}>
			{countries.map((country) => {
				return <CountryItem country={country} key={country.country} />;
			})}
		</ul>
	);
}

export default CountryList;
