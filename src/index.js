import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

      searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();

  const name = event.target.value.trim();

  countryInfo.innerHTML = '';
  countryList.innerHTML = '';



  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      renderCountryList(countries);
    })
    .catch(err => Notify.failure('Oops, there is no country with that name'));
}

function renderCountryList(countries) {
  if (countries.length === 1) {
    renderCountryInfo(countries);
  } else {
    renderCountrysList(countries);
  }
}

function renderCountryInfo(country) {
  const markup = country
    .map(({flags, name, capital, population, languages}) => {

        return `<img  src='${flags.svg}' alt='${name.official}' width="150" height="50"
       />
        <table class="country-info__list">
            <tr><td>Name: </td><td>  ${name.official}</td></tr>
            <tr><td>Capital: </td><td>  ${capital}</td></tr>
            <tr><td>Population: </td><td>  ${population}</td></tr>
            <tr><td>Languages: </td><td>  ${Object.values(languages)}</td></tr>
        </table>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
function renderCountrysList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
                <div>
                    <img src="${flags.svg}" alt="Flag of ${name.official}" width="100" height="50">
                    <p >${name.official}</p>
                </div>
                `;
    })

    .join('');

  countryInfo.innerHTML = markup;
}



