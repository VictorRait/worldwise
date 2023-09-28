import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./Form.module.css";
import Button from "./Button";
import "react-datepicker/dist/react-datepicker.css";
import ButtonBack from "./ButtonBack";
import {useUrlPosition} from "../hooks/useUrlPosition";
import {useEffect} from "react";
import Message from "../components/Message";
import DatePicker from "react-datepicker";
import {useCities} from "../contexts/CitiesContext";
import EmojitoPngflag from "./EmojitoPngflag";
export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
	const {createCity, isLoading} = useCities();

	const [lat, lng] = useUrlPosition();
	const [cityName, setCityName] = useState("");
	const [country, setCountry] = useState("");
	const [date, setDate] = useState(new Date());
	const [notes, setNotes] = useState("");
	const [isLoadingGeocoding, setisLoadingGeocoding] = useState(false);
	const [emoji, setEmoji] = useState("");
	const [geocodingError, setGeocodingError] = useState("");
	const navigate = useNavigate();
	useEffect(
		function () {
			if (!lat && !lng) return;
			async function fetchCityData() {
				try {
					setGeocodingError("");
					setisLoadingGeocoding(true);
					const res = await fetch(
						`${BASE_URL}?latitude=${lat}&longitude=${lng}`
					);
					const data = await res.json();

					if (data.countryCode === "")
						throw new Error(
							"That doesn't seem to be a city. Click on another place.😯"
						);
					setCityName(data.city || data.locality || "");
					setCountry(data.countryName);
					setEmoji(convertToEmoji(data.countryCode));
				} catch (err) {
					setGeocodingError(err.message);
				} finally {
					setisLoadingGeocoding(false);
				}
			}
			fetchCityData();
		},
		[lat, lng]
	);

	if (geocodingError) return <Message message={geocodingError} />;
	if (!lat && !lng)
		return (
			<Message message={"Start by clicking somewhere on the map"}></Message>
		);

	async function handleSubmit(e) {
		e.preventDefault();

		if (!cityName && !date) return;
		// const newCity = {
		//   cityName, country, emoji,date,notes, position: {lat,lng}
		// }
		const newCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: {lat, lng},
			id: 321 + Math.random() * 10,
		};
		await createCity(newCity);
		navigate("/app/cities");
	}
	return (
		<form
			className={`${styles.form} ${isLoading ? styles.loading : ""}`}
			onSubmit={handleSubmit}>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input
					id="cityName"
					onChange={(e) => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>
					<EmojitoPngflag flag={emoji} />
				</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>
				{/* <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
				<DatePicker
					id="date"
					onChange={(date) => setDate(date)}
					selected={date}
					dateFormat="dd/MM/yyyy"
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea
					id="notes"
					onChange={(e) => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type="primary">Add</Button>
				<ButtonBack />
			</div>
		</form>
	);
}

export default Form;
