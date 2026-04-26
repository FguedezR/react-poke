import { useState, useEffect } from "react";

function App() {
  // guarda lo que el usuario escribe en el input
  const [searchTerm, setSearchTerm] = useState("");

  //guarda los datos del pokemon cuando la api responde con exito
  // null si todavia no hemos encontrado ninguno
  const [pokemon, setPokemon] = useState(null);

  //true mientras se espera la respuesta de la api
  const [loading, setLoading] = useState(false);

  //guarda el mensaje de error si falla api o pokemon no encontrado
  const [error, setError] = useState(null);

  useEffect(() => {
    //campo está vacío, reseteamos todo y salimos.
    //evitamos llamadas innecesarias a la API.
    if (searchTerm.trim() === "") {
      setPokemon(null);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchPokemon(searchTerm.trim().toLowerCase());
    }, 500);

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
          throw new Error(`No se encontró ningún Pokémon llamando ${name}`);
        }
        throw new Error(`Error en la API: ${response.status}`);
      }
      const data = await response.json();

      // extraemos lo esencial de la api
      setPokemon({
        id: data.id,
        name: data.name,
        image:
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        height: data.height / 10,
        weight: data.weight / 10,
        abilities: data.abilities.map((a) => a.ability.name),
        stats: data.stats.map((a) => ({
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

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__pokeball" aria-hidden="true" />
        <h1 className="header__title">
          <span className="header__title--poke">Poké</span>Finder
        </h1>
        <p className="header__subtitle">Busca cualquier Pokémon al instante</p>
      </header>

      {/* busqueda */}
      <main className="main">
        <div className="search-container">
          <div className="search-wrapper">
            {/* icono de busqueda */}
            <span className="search-icon" aria-hidden="true">
              ⚡
            </span>
            {/* input del estado searchTerm */}
            <input
              type="text"
              className="search-input"
              placeholder="Escribe un nombre o un número..."
              value={searchTerm}
              onChange={handleInputChange}
              autoFocus
              aria-label="Buscar Pokémon"
            />
            {/* limpiar buscador visible si hay texto*/}
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

        {loading && (
          <div className="status-container">
            <div className="pokeball-loader" aria-label="Cargando...">
              <div className="pokeball-loader__top" />
              <div className="pokeball-loader__bottom" />
              <div className="pokeball-loader__button" />
            </div>
            <p className="status-text">Buscando Pokémon</p>
          </div>
        )}

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

        {/* tarjeta pokemon encontrado solo se mustra si es null y no hay carga ni error */}
        {pokemon && !loading && !error && (
          <PokemonCard pokemon={pokemon}/>
        )}

        {/*estado inicial, no se busca nada */}
        {!searchTerm && !loading && !error && !pokemon && (
          <div className="status-container">
            <div className="empty-state">
              <div className="empty-state__pokeballs" aria-hidden="true">
                <span>⬤</span><span>⬤</span><span>⬤</span>
              </div>
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
