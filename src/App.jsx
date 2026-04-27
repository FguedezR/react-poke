import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import "./App.css";

function App() {
  // guarda lo que el usuario escribe en el input
  const [searchTerm, setSearchTerm] = useState("");

  // guarda los datos del Pokémon cuando la api responde con éxito
  // null significa "todavía no hemos encontrado ninguno"
  const [pokemon, setPokemon] = useState(null);

  // true mientras esperamos la respuesta de la api
  const [loading, setLoading] = useState(false);

  // guarda el mensaje de error si algo falla
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setPokemon(null);
      setError(null);
      return;
    }

    const currentSearch = searchTerm.trim().toLowerCase();

    const timer = setTimeout(() => {
      fetchPokemon(currentSearch);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPokemon = async (name) => {
    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No se encontró ningún Pokémon llamado "${name}"`);
        }
        throw new Error(`Error de la API: ${response.status}`);
      }
      const data = await response.json();
      setPokemon({
        id: data.id,
        name: data.name,
        image:
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        height: data.height / 10, // lo convertimos a metros
        weight: data.weight / 10, // lo convertimos a kg
        abilities: data.abilities.map((a) => a.ability.name),
        stats: data.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* manejador del input */
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="app">
      {/* cabecera */}
      <header className="header">
        <div className="header__pokeball" aria-hidden="true" />
        <h1 className="header__title">
          <span className="header__title--poke">Poké</span>Finder
        </h1>
        <p className="header__subtitle">Busca cualquier Pokémon al instante</p>
      </header>

      {/* sección de búsqueda */}
      <main className="main">
        <div className="search-container">
          <div className="search-wrapper">
            {/* icono de búsqueda */}
            <span className="search-icon" aria-hidden="true">
              ⚡
            </span>

            {/* input - valor siempre viene del estado searchTerm */}
            <input
              type="text"
              className="search-input"
              placeholder="Escribe un nombre o número..."
              value={searchTerm}
              onChange={handleInputChange} // actualiza el estado en cada tecla
              autoFocus // foco automático
              aria-label="Buscar Pokémon"
            />

            {/* para limpiar el buscador, solo visible si hay texto */}
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="status-container">
            <div className="pokeball-loader" aria-label="Cargando...">
              <div className="pokeball-loader__top" />
              <div className="pokeball-loader__bottom" />
              <div className="pokeball-loader__button" />
            </div>
            <p className="status-text">Buscando Pokémon...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && !loading && (
          <div className="status-container">
            <div className="error-card" role="alert">
              <span className="error-card__icon">😵</span>
              <p className="error-card__message">{error}</p>
              <p className="error-card__hint">
                Prueba con el nombre exacto o el número del Pokémon
              </p>
            </div>
          </div>
        )}

        {/* tarjeta del Pokémon encontrado */}
        {/* solo se muestra si pokemon no es null y no hay carga ni error */}
        {pokemon && !loading && !error && <PokemonCard pokemon={pokemon} />}

        {/* estado inicial. no se ha buscado nada todavía */}
        {!searchTerm && !loading && !error && !pokemon && (
          <div className="status-container">
            <div className="empty-state">
              <div className="empty-state__pokeballs" aria-hidden="true">
                <span>⬤</span>
                <span>⬤</span>
                <span>⬤</span>
              </div>
              <p className="empty-state__text">
                ¿A qué Pokémon estás buscando, entrenador?
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Datos obtenidos de{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
