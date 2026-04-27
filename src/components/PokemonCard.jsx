function PokemonCard({ pokemon }) {
  const typeColors = {
    fire: { bg: "#FF6B35", text: "#fff" },
    water: { bg: "#4A90D9", text: "#fff" },
    grass: { bg: "#5CB85C", text: "#fff" },
    electric: { bg: "#F5A623", text: "#1a1a1a" },
    psychic: { bg: "#E91E8C", text: "#fff" },
    ice: { bg: "#74D7C4", text: "#1a1a1a" },
    dragon: { bg: "#6B3FA0", text: "#fff" },
    dark: { bg: "#2D2D2D", text: "#fff" },
    fairy: { bg: "#F4A7C3", text: "#1a1a1a" },
    fighting: { bg: "#C0392B", text: "#fff" },
    poison: { bg: "#8E44AD", text: "#fff" },
    ground: { bg: "#D4A843", text: "#1a1a1a" },
    rock: { bg: "#8B7355", text: "#fff" },
    bug: { bg: "#8BC34A", text: "#1a1a1a" },
    ghost: { bg: "#4A235A", text: "#fff" },
    steel: { bg: "#8E9BAE", text: "#fff" },
    normal: { bg: "#A8A878", text: "#fff" },
    flying: { bg: "#89AAE6", text: "#1a1a1a" },
  };

  const primaryType = pokemon.types[0];
  const primaryColor = typeColors[primaryType]?.bg || "#777";

  /* formateo de las minusculas */
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatStatName = (name) => {
    const names = {
      hp: "HP",
      attack: "Ataque",
      defense: "Defensa",
      "special-attack": "Sp. Ataque",
      "special-defense": "Sp. Defensa",
      speed: "Velocidad",
    };

    return names[names] || capitalize(names);
  };

  return (
    <div className="pokemon-card" style={{ "--type-color": primaryColor }}>
      {/* fondo numero pokemon */}
      <div className="pokemon-card__bg-number" aria-hidden="true">
        #{String(pokemon.id).padStart(3, "0")}
      </div>

      {/* imagen - nombre */}
      <div className="pokemon-card__header">
        <div className="pokemon-card__image-wrapper">
          <img
            src={pokemon.image}
            alt={`Imagen oficial de ${pokemon.name}`}
            className="pokemon-card__image"
            /* por si falla la imagen */
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
            }}
          />
        </div>
      </div>

      <div className="pokemon-card__info">
        <span className="pokemon-card__number">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <h2 className="pokemon-card__name">{capitalize(pokemon.name)}</h2>

        <div className="pokemon-card__types">
          {pokemon.types.map((types) => (
            <span
              key={type}
              className="pokemon-card__type-badge"
              style={{
                backgroundColor: typeColors[type]?.bg || "#777",
                color: typeColors[type]?.text || "#fff",
              }}
            >
              {capitalize(type)}
            </span>
          ))}
        </div>
      </div>

      <div className="pokemon-card__physical">
        <div className="pokemon-card__physical-item">
          <span className="pokemon-card__physical-label">Altura</span>
          <span className="pokemon-card__physical-value">
            {pokemon.height} m
          </span>
        </div>
        <div className="pokemon-card__physical-divider" />
        <div className="pokemon-card__physical-item">
          <span className="pokemon-card__physical-label">Peso</span>
          <span className="pokemon-card__physical-value">
            {pokemon.weight} kg
          </span>
        </div>
        <div className="pokemon-card__physical-divider" />
        <div className="pokemon-card__physical-item">
          <span className="pokemon-card__physical-label">Habilidades</span>
          <span className="pokemon-card__physical-value">
            {pokemon.abilities.map(capitalize).join(", ")}
          </span>
        </div>
      </div>

      {/* stats de combate con barras de progreso */}
      <div className="pokemon-card__stats">
        <h3 className="pokemon-card__stats-title">Stats base</h3>
        {pokemon.stats.map((stat) => (
          <div key={stat.name} className="pokemon-card__stat-row">
            <span className="pokemon-card__stat-name">
              {formatStatName(stat.name)}
            </span>
            <span className="pokemon-card__stat-value">{stat.value}</span>

            <div className="pokemon-card__stat-bar">
              <div
                className="pokemon-card__stat-bar-fill"
                style={{
                  width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard;
