const LandingPage = () => {
  return (
    <div>
      
      {/* --- NAVBAR --- */}
      <nav>
        <div>
          <span>⚡</span> Velo<span>City</span>
        </div>
        <div>
          <a href="/offer">Oferta</a>
          <a href="/hubs">Lokalizacje</a>
          <a href="/login">Zaloguj</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header>
        <div>
          <h1>
            ZDOMINUJ <br />
            <span>MIASTO</span>
          </h1>
          <p>
            Profesjonalna flota e-rowerów dla kurierów Food Delivery (i nie tylko!).
            <br />Zapomnij o ładowaniu. My zajmiemy się sprzętem, Ty zarabiaj.
          </p>
          <div>
            <a href="/wizard">
              Rozpocznij zmianę ➜
            </a>
            <button>Zobacz flotę</button>
          </div>
        </div>
        <div></div> 
      </header>

      <section>
        <div>
          <h3>120 km</h3>
          <p>Zasięgu na jednym ładowaniu</p>
        </div>
        <div>/</div>
        <div>
          <h3>45 km/h</h3>
          <p>Maksymalnej prędkości (wspomaganie)</p>
        </div>
        <div>/</div>
        <div>
          <h3>0 zł</h3>
          <p>Kosztów serwisu i napraw</p>
        </div>
      </section>

      <section>
        <h2>Dlaczego <span>VeloCity</span>?</h2>
        <div>
          <div>
            <div>🔋</div>
            <h3>Swap & Go</h3>
            <p>Padła bateria? Wjedź do Hubu, wymień na naładowaną w 30 sekund i wracaj do pracy.</p>
          </div>
          <div>
            <div>🛡️</div>
            <h3>Pełne Ubezpieczenie</h3>
            <p>Nie martw się kradzieżą czy awarią. W cenie wynajmu masz pełen pakiet ochronny.</p>
          </div>
          <div>
            <div>📱</div>
            <h3>Appka do Zarządzania</h3>
            <p>Rezerwuj sloty, sprawdzaj dostępność i zgłaszaj usterki jednym kliknięciem.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer>
        <p>&copy; 2025 VeloCity Systems. Designed for the gig economy.</p>
      </footer>
    </div>
  );
};

export default LandingPage;