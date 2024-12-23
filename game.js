// game.js
function getTelegramUserId() {
  try {
    return window.Telegram.WebApp.initDataUnsafe.user.id;
  } catch (error) {
    return 1000000000;
  }
}
function loadBecScript(env) {
  if (!env) {
    const urlParams = new URLSearchParams(window.location.search);
    env = urlParams.get('env') || 'prod';
  }

  const existingScript = document.querySelector('#bec-script');
  if (existingScript) {
    document.body.removeChild(existingScript);
  }

  const script = document.createElement('script');
  script.id = 'becScript';
  script.src = env === 'dev' 
    ? "https://bec-dev.apps-network.net/latest/bec.js?walletAddress=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D"
    : "https://bec.apps-network.net/latest/bec.js?walletAddress=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D";
  script.async = true;

  script.onload = () => {
    console.log("Bec script loaded successfully!");
    if (typeof TE !== 'undefined' && typeof TE.onLoad === 'function') {
      TE.onLoad();
    } else {
      console.warn("TE.onLoad function not available");
    }
  };

  script.onerror = () => {
    console.error("Failed to load Bec script");
  };

  document.body.appendChild(script);

  document.addEventListener('becLoaded', function (event) {
    if (typeof TE !== 'undefined' && TE.configureOfferWallStyle) {
      TE.configureOfferWallStyle({
        topBar: {
          backgroundColor: '#2c3e50',
          textColor: '#ecf0f1'
        },
        content: {
          backgroundColor: '#34495e',
          appNameColor: '#ecf0f1',
          appDescriptionColor: '#bdc3c7'
        },
        button: {
          backgroundColor: '#3498db',
          textColor: '#ffffff',
          highlightedBackgroundColor: '#2980b9',
          highlightedTextColor: '#ffffff',
          outlineColor: '#3498db'
        }
      });
    } else {
      console.warn('TE is not defined or configureOfferWallStyle is missing.');
    }
    // add blacklist ads - examples values
    if (TE && typeof TE.setBlacklistAds === 'function') {
      TE.setBlacklistAds([
      'SEED App - Mine SEED', // ad name 
      '66ec39da467ed0b3fdea3539', // ad id
      '6724665873652075dc5b388f', // ad id
      '123', // ad name 
      'trung test 3' // ad name
      ]);
    } else {
        console.warn("TE.setBlacklistAds function not available");
    }
  });
  document.addEventListener('TEAdClicked', function (event) {
      const adInfo = event?.detail;
      console.log('TEAdClicked',adInfo);
      alert('TEAdClicked=> ad: ' + JSON.stringify(adInfo || {}));
  });
}
const { useState, useEffect, useCallback } = React;

const GameObject = ({ position, onClick, imageUrl }) => (
  <img
    src={imageUrl}
    style={{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
    onClick={onClick}
    alt="Game Object"
  />
);

const ScorePanel = ({ score }) => (
  <div style={{
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: '24px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 10, 
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Optional: add a text shadow for better visibility on varying backgrounds
  }}>
    Score: {score}
  </div>
);

const AboutModal = ({ isOpen, onClose, gameInfo, environment, isTMA }) => {
  if (!isOpen) return null;
  const [userId, setUserId] = useState('N/A');
  
  useEffect(() => {
    const fetchTelegramUserId = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe || {};
        
        setUserId(initDataUnsafe.user?.id || 'N/A');
        // Update the user-id element if it exists (for compatibility with index.html)
        const userIdElement = document.getElementById('user-id');
        if (userIdElement) {
          userIdElement.textContent = `Telegram user ID: ${initDataUnsafe.user?.id || 'N/A'}`;
        }
      }
    };
    fetchTelegramUserId();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
      }}>
        <h2>About {gameInfo.name}</h2>
        <h3>Background Image</h3>
        <p dangerouslySetInnerHTML={{ __html: gameInfo.backgroundCredit }} />
        <h3>Object Image</h3>
        <p dangerouslySetInnerHTML={{ __html: gameInfo.objectCredit }} />
        <h3>Apps Network Role</h3>
        <p>Current role: {role || 'Not specified'}</p>
        <h3>Telegram User Info (Debug)</h3>
        <p>User ID: {userId}</p>
        <h3>Environment</h3>
        <p>Current environment: {environment}</p>
        <h3>TMA mode</h3>
        <p>Is in TMA: {isTMA}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const MainMenu = ({ onStartGame, onPause, onResume, onShowTopScores, onQuit, onShowAbout, gameState }) => {

  const handlePauseClick = useCallback(() => {
    onPause();
    if (window.TE && typeof window.TE.offerWall === 'function') {
      window.TE.offerWall();  // show offer wall on a button click
    } else {
      console.error('TE is not defined or offerWall is not a function');
    }
  }, [onPause]);
    
  return (
  <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
    {gameState === 'menu' && <button onClick={onStartGame}>Start New Game</button>}
    {gameState === 'playing' && <button onClick={handlePauseClick}>Pause</button>}
    {gameState === 'paused' && <button onClick={onResume}>Resume</button>}
    <button onClick={onShowTopScores}>Top Scores</button>
    <button onClick={onShowAbout}>About</button>
    <button onClick={onQuit}>Quit</button>
  </div>);
}

const GameTitle = ({ title }) => (
  <h1 style={{
    position: 'absolute',
    top: 60,
    left: 10,
    fontSize: '28px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 10,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  }}>
    {title}
  </h1>
);

const Game = ({ config }) => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState('menu');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [environment, setEnvironment] = useState('prod');
  const [clickVerified, setClickVerified] = useState(false);
  const [isTMA, setIsTMA] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const env = urlParams.get('env') || 'prod';
    const userRole = urlParams.get('role');
    setEnvironment(env);
    setRole(userRole);

    loadBecScript(env);
  
    // Improved TMA detection
    const detectTMA = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        // Additional checks to ensure it's a real Telegram WebApp
        if (typeof window.Telegram.WebApp.initData === 'string' && 
            window.Telegram.WebApp.initData.length > 0 &&
            typeof window.Telegram.WebApp.initDataUnsafe === 'object' &&
            Object.keys(window.Telegram.WebApp.initDataUnsafe).length > 0) {
          console.log('Verified Telegram WebApp environment');
          return true;
        } else {
          console.log('Telegram WebApp object found, but seems invalid');
          return false;
        }
      }
      // Check for Telegram-specific URL parameters
      if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppVersion')) {
        console.log('Telegram-specific URL parameters found');
        return true;
      }
      console.log('Not running in TMA environment');
      return false;
    };

    const tmaDetected = detectTMA();
    setIsTMA(tmaDetected);
    console.log('TMA detected:', tmaDetected); // Debug log

    let clickId = null;
    let userId = getTelegramUserId();;

    if (tmaDetected) {
      // Attempt to get Telegram WebApp data
      if (window.Telegram && window.Telegram.WebApp) {
        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        userId = initDataUnsafe.user?.id || null;
        clickId = initDataUnsafe.start_param || null;
        if (clickId && clickId.startsWith('clickid_')) {
          clickId = clickId.split('_')[1];  // Extract the actual click ID
        }
      }
      // If we couldn't get the data from WebApp, try URL parameters
      if (!userId) {
        const tgWebAppData = urlParams.get('tgWebAppData');
        if (tgWebAppData) {
          try {
            const decodedData = JSON.parse(atob(tgWebAppData));
            userId = decodedData.user?.id || null;
          } catch (error) {
            console.error('Error parsing tgWebAppData:', error);
          }
        }
      }
      if (!clickId) {
        clickId = urlParams.get('start_param') || null;
      }
    } else {
      clickId = urlParams.get('click_id') || null;
    }
    
    if (userRole) {
      verifyClick(clickId, userId, env, tmaDetected, userRole);
    } else {
      console.log('No role specified, skipping click verification');
    }

    // const script = document.createElement('script');
    // script.src = env === 'dev' 
    //   ? "https://tma-demo.dmtp.tech/sdk/0.0.8/bec.js?walletAddress=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D"
    //   : "https://bec.dmtp.tech/0.0.8/bec.js?walletAddress=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D";
    // script.async = true;
    // document.body.appendChild(script);
    // return () => {
    //   document.body.removeChild(script);
    // };
  }, []);

  const verifyClick = async (clickId, userId, env, isTMA, userRole) => {
    try {
      console.log('Verifying click:', { clickId, userId, env, userRole, isTMA }); // Debug log
      
      let apiUrl;
      const baseUrl = env === 'dev' ? 'https://click-dev.dmtp.tech' : 'https://click.dmtp.tech';
  
      if (userRole === 'publisher') {
        // Publishers use GET to retrieve click events
        apiUrl = `${baseUrl}/banners/events?`;
        if (isTMA && userId) {
          apiUrl += `wa=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D&tui=${userId}`;
        } else if (!isTMA && clickId) {
          apiUrl += `wa=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D&tui=${userId}`;
        } else {
          console.error('Invalid parameters for publisher verification');
          return;
        }
        
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('Publisher events retrieved:', data);
          // Check if there are any items in the response
          if (data.items && data.items.length > 0) {
            const clickEvents = data.items.filter(item => item.action === "CLICK");
            if (clickEvents.length > 0) {
              console.log(`${clickEvents.length} offer wall click event(s) found, verifying click`);
              setClickVerified(true);
              const newScore = data.items.length * 10;
              setScore(newScore);
              console.log(`Set initial score to ${newScore} based on ${data.items.length} event(s)`);
            } else {
              console.log('No click events found');
            }
          } else {
            console.log('No events found in the response');
          }
        } else {
          console.log('Failed to retrieve publisher events');
        }
      } else if (userRole === 'advertiser') {
        // Advertisers use the verify endpoint
        if (isTMA) {
          if (!userId) {
            console.error('User ID is required for TMA mode verification');
            return;
          }
          apiUrl = `${baseUrl}/banners/verify?tui=${encodeURIComponent(userId)}`;
          if (clickId) {
            apiUrl += `&click_id=${encodeURIComponent(clickId)}`;
          }
        } else {
          if (!clickId) {
            console.error('Click ID is required for non-TMA mode verification');
            return;
          }
          apiUrl = `${baseUrl}/banners/verify?click_id=${encodeURIComponent(clickId)}`;
        }
  
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log('Advertiser click verification response:', data);
          if (data.valid) {
            setClickVerified(true);
            setScore(100); // Set initial score to 100 for verified clicks
            console.log('Click verified, set score to 100!');
          }
        } else {
          console.log('Verification failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    document.title = config.name;
  }, [config.name]);

  const moveObject = useCallback(() => {
    const maxX = window.innerWidth - 100; // Assuming object width is 100px
    const maxY = window.innerHeight - 155; // 100px for object height + 50px for ad banner
    setPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY + 155, // Add 115px to account for ad banner
    });
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(moveObject, config.moveInterval);
      return () => clearInterval(interval);
    }
  }, [gameState, moveObject, config.moveInterval]);

  const handleClick = () => {
    setScore(prevScore => prevScore + 1);
    moveObject();
  };

  const startGame = () => {
    if (!clickVerified) {
      setScore(0); // Reset score to 0 for non-verified clicks
    }
    setGameState('playing');
    moveObject();
  };

  const pauseGame = useCallback(() => {
    setGameState('paused');
    // The offer wall is now opened in the MainMenu component
  }, []);

  const resumeGame = () => setGameState('playing');
  const showTopScores = () => alert('Top Scores: Coming soon!');
  const quitGame = () => {
    setGameState('menu');
    if (!clickVerified) {
      setScore(0);
    }
  };

  const showAbout = () => setIsAboutOpen(true);
  const closeAbout = () => setIsAboutOpen(false);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${config.backgroundUrl})`,
      backgroundSize: 'cover',
      position: 'relative',
    }}>
      <GameTitle title={config.name} />
      <ScorePanel score={score} />
      <MainMenu
        onStartGame={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onShowTopScores={showTopScores}
        onShowAbout={showAbout}
        onQuit={quitGame}
        gameState={gameState}
      />
      {gameState !== 'menu' && (
        <GameObject
          position={position}
          onClick={handleClick}
          imageUrl={config.objectUrl}
        />
      )}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={closeAbout}
        gameInfo={{
          name: config.name,
          backgroundCredit: config.backgroundCredit,
          objectCredit: config.objectCredit,
        }}
        environment={environment}
        isTMA={isTMA}
        role={role}
      />
    </div>
  );
};

const games = {
  cosmicClicker: {
    name: "Cosmic Clicker",
    backgroundUrl: 'game_assets/space-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@andyjh07?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Andy Holmes</a> on <a href="https://unsplash.com/photos/milky-way-during-night-time-LUpDjlJv4_c?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: 'game_assets/spaceship-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 3000,
  },
  forestFriend: {
    name: "Forest Friend",
    backgroundUrl: 'game_assets/forest-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@howardbouchevereau?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Howard Bouchevereau</a> on <a href="https://unsplash.com/photos/a-forest-of-tall-trees-nifQzholGAc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: 'game_assets/forest_friend-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 2500,
  },
  balloonBopper: {
    name: "Balloon Bopper",
    backgroundUrl: 'game_assets/sky-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@thomasdupon_be?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Thomas Dupon</a> on <a href="https://unsplash.com/photos/white-clouds-and-blue-sky-during-daytime-KuuHp9HgCI0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: 'game_assets/balloon-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 3500,
  },
  deepSeaClicker: {
    name: "Deep Sea Clicker",
    backgroundUrl: 'game_assets/ocean-background.jpg',
    backgroundCredit: 'Photo by <a href="https://unsplash.com/@silasbaisch?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Silas Baisch</a> on <a href="https://unsplash.com/photos/blue-and-clear-body-of-water-K785Da4A_JA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    objectUrl: 'game_assets/jellyfish-cute.png',
    objectCredit: 'Photo by <a href="https://designer.microsoft.com/consumerTermsOfUse/en-GB/consumerTermsOfUse.pdf">DALLE 3</a>',
    moveInterval: 3000,
  },
};

// Get the game type from the URL, default to cosmicClicker
const getGameType = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('game') || 'cosmicClicker';
};

const gameType = getGameType();
const gameConfig = games[gameType] || games.cosmicClicker;

ReactDOM.render(
  <Game config={gameConfig} />,
  document.getElementById('game-container')
);