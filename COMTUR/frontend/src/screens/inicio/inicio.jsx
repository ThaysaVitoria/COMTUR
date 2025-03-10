import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavbarUsr from "../../components/user/navbarUsr.jsx";
import FooterUsr from "../../components/user/footerUsr.jsx";
import "../inicio/inicio.css";
import empresa from '../../assets/EmpresaCard.svg';
import rural from '../../assets/RuralCard.svg';
import saude from '../../assets/SaudeCard.svg';
import noticia from '../../assets/NoticiaCard.svg';
import eventos from '../../assets/EventosCard.svg';
import cultura from '../../assets/CulturaCard.svg';
function Inicio() {
  const [outrasNoticias, setOutrasNoticias] = useState([]);
  const [atualizarData, setAtualizarData] = useState(true);
  const [turismo, setTurismo] = useState([]);
  const [parametro, setParametro] = useState([]);
  const navigate = useNavigate();
  const baseUrl = "https://localhost:7256/api/Noticia";
  const [isMobile, setIsMobile] = useState(false);
  const [idadeMunicipio, setIdadeMunicipio] = useState(0);
  const baseUrlParametro = "https://localhost:7256/api/Parametro/1";
  const { id } = useParams();
  const baseUrlTurismo = "https://localhost:7256/api/Turismo";
  const [currentTurismoIndex, setCurrentTurismoIndex] = useState(0);

  const pedidoGet = async () => {
    try {
      const response = await axios.get(baseUrlTurismo);
      const turismosFiltrados = response.data.filter(
        (turismo) => turismo.status === 2
      );
      setTurismo(turismosFiltrados);
    } catch (error) {
      console.log("API error:", error);
    }
  };

  const pedidoGetParametro = async () => {
    try {
      const response = await axios.get(baseUrlParametro);
      setParametro(response.data);
      if (response.data.dataFundacao) {
        calcularIdadeMunicipio(response.data.dataFundacao);
      }
    } catch (error) {
      console.log("API error:", error);
    }
  };

  const calcularIdadeMunicipio = (dataFundacao) => {
    const dataFundacaoObj = new Date(dataFundacao);
    const anoFundacao = dataFundacaoObj.getFullYear();
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - anoFundacao;
    setIdadeMunicipio(idade);
  };


  function formatarDataParaExibicao(data) {
    const partes = data.split("-");
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return data; // Retorna a data original se não estiver no formato esperado
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Chama a função uma vez para definir o estado inicial
    window.addEventListener("resize", handleResize); // Adiciona o listener

    return () => {
      window.removeEventListener("resize", handleResize); // Limpa o listener ao desmontar
    };
  }, []);

  useEffect(() => {
    if (atualizarData) {
      console.log("useEffect executed");
      pedidoGetParametro();
      setAtualizarData(false);
    }
  }, [atualizarData]);

  useEffect(() => {
    if (atualizarData) {
      console.log("useEffect executed"); // Log para verificar se o useEffect está sendo executado
      pedidoGet();
      setAtualizarData(false);
    }
  }, [atualizarData]);

  useEffect(() => {
    const obterOutrasNoticias = async () => {
      try {
        const response = await axios.get(`${baseUrl}`);
        const noticiasFiltradas = response.data.filter(
          (noticia) => noticia.status === 2
        );
        setOutrasNoticias(noticiasFiltradas);
      } catch (error) {
        console.error("Erro ao obter outras notícias:", error);
      }
    };

    obterOutrasNoticias();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTurismoIndex((prevIndex) =>
        prevIndex === turismo.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [turismo]);

  console.log(turismo);

  return (
    <div className="">
      <NavbarUsr />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Open+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="container-fluid p-0 ">
        <div className="bg-black">
          {turismo.length > 0 && (
            <div className="flex relative items-center bg-black">
              <div
                className={`absolute inset-0 w-full h-full bg-cover bg-center opacity-50`}
                style={{
                  backgroundImage: `url(${turismo[currentTurismoIndex].imagemTurismo[0].imagem})`,
                }}
              />
              <div
                className={`relative flex flex-col w-full h-[200px] sm:h-[400px] lg:h-[500px] mb-8 gap-2 z-10`}
              >
                <h3 className="flex justify-center items-end uppercase h-28 sm:h-60 gap-0 text-xl sm:text-2xl text-slate-50 font-bold text-center">
                  {turismo[currentTurismoIndex].nome}
                </h3>
                <button
                  className="mx-32 sm:mx-[550px] py-1 border-3 rounded-sm bg-[#ED7833] text-xs sm:text-2xl font-medium text-slate-50 bg-transparent transition-colors duration-300"
                  onClick={() => {
                    navigate(
                      `/visualizarTurismo/${turismo[currentTurismoIndex].id}`
                    );
                  }}
                >
                  Leia Mais
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="container-xxl pb-5 pt-3">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                <p className="section-title bg-white text-start text-black pe-3">
                  O QUE É TURISMO?
                </p>
                <h1 className="mb-3">Conheça mais sobre a cidade de Jales!</h1>

                {parametro && ( // Verifique se 'parametro' não é null
                  <div>
                    <p className="mb-4 text-gray-900" >
                      {parametro.definicaoTurismo}
                    </p>
                    <p>
                      <i className="fa fa-check text-[#fabc0b] me-1"></i> {parametro.beneficios}
                    </p>
                  </div>
                )}
                <button className="btn btnmais rounded-pill hover:scale-105 py-3 px-5 mt-3 text-[#fefefe]" onClick={() => { navigate(`/todosTurismos`) }}>
                  Explorar
                </button>
              </div>
              {parametro && (
                <div className="col-lg-6  text-[#fefefe]">
                  <div className="rounded overflow-hidden">
                    <div className="row g-0">
                      <div className="col-sm-6 wow fadeIn">
                        <div className="text-center bg-[#58afae] py-5 px-4">
                          <div className="d-flex justify-content-center">
                            <img
                              className="img-fluid mb-4"
                              src="./src/assets/experience.png"
                              alt=""
                            />
                          </div>
                          <h1
                            className="display-6 text-white"
                            data-toggle="counter-up"
                          >
                            {idadeMunicipio}

                          </h1>
                          <span className="fs-5 fw-semi-bold text-white">
                            Anos de Fundação
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 bg-[#064d56] wow fadeIn">
                        <div className="text-center bg-[#064d56] py-5 px-4">
                          <div className="d-flex justify-content-center">
                            <img
                              className="img-fluid mb-4"
                              src="./src/assets/award.png"
                              alt=""
                            />
                          </div>
                          <h1 className="display-6" data-toggle="counter-up">
                            {parametro.areaTerritorial}

                          </h1>
                          <span className="fs-5 fw-semi-bold text-white">
                            Área Territorial
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 bg-[#064d56] wow fadeIn">
                        <div className="text-center bg-[#064d56] py-5 px-4">
                          <div className="d-flex justify-content-center">
                            <img
                              className="img-fluid mb-4"
                              src="./src/assets/animal.png"
                              alt=""
                            />
                          </div>
                          <h1 className="display-6" data-toggle="counter-up">
                            {parametro.distanciaCapital}
                          </h1>
                          <span className="fs-5 fw-semi-bold text-white">
                            da cidade de São Paulo
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 wow fadeIn">
                        <div className="text-center  bg-[#ed7833] py-5 px-4">
                          <div className="d-flex justify-content-center">
                            <img
                              className="img-fluid mb-4"
                              src="./src/assets/client.png"
                              alt=""
                            />
                          </div>
                          <h1
                            className="display-6 text-white"
                            data-toggle="counter-up"
                          >
                            {parametro.habitantes}
                          </h1>
                          <span className="fs-5 fw-semi-bold text-white">
                            Habitantes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="inline-flex items-center justify-center w-full p-4">
          <hr className="w-full h-1 my-6 opacity-100 bg-[#58AFAE] border-0 rounded" />
          <div className="absolute justify-center items-center px-4 -translate-x-1/2 bg-white left-1/2">
            <h1 className="text-[#373636] sm:text-2xl text-sm font-bold px-6">
              CONHEÇA JALES
            </h1>
          </div>
        </div>

        {/* menu de card  */}
        <div className="container mt-4">
          {isMobile ? (
            <div id="cardCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-touch="true"> {/* Adicionado para permitir deslizar */}
              <div className="carousel-inner">

                <div className="carousel-item active">
                  <div className="d-flex justify-content-center">
                    <Link to={`/todosturismos/${5}`} className="card cardlaranja p-1 text-white mx-2 text-decoration-none">
                      <img className="m-3" src={cultura} alt="icone cultura" />
                      <h6 className="card-title text-center">Cultura</h6>
                    </Link>
                    <Link to={`/todosturismos/${6}`} className="card cardazul p-1 bg-info text-white mx-2 text-decoration-none">
                      <img className="m-3" src={rural} alt="icone rural" />
                      <h6 className="card-title text-center">Turismo Rural</h6>
                    </Link>
                    <Link to="/todasEmpresas" className="card cardlaranja p-1 bg-warning text-white mx-2 text-decoration-none">
                      <img className="m-3" src={empresa} alt="icone hotel" />
                      <h6 className="card-title text-center">Empresas</h6>
                    </Link>
                  </div>
                </div>

                <div className="carousel-item">
                  <div className="d-flex justify-content-center">
                    <Link to={`/todosturismos/${7}`} className="card cardazul p-1 text-white mx-2 text-decoration-none">
                      <img className="m-3" src={saude} alt="icone saude" />
                      <h6 className="card-title text-center">Saúde</h6>
                    </Link>
                    <Link to="/todasNoticias" className="card cardlaranja p-1 text-white mx-2 text-decoration-none">
                      <img className="m-3" src={noticia} alt="icone notícias" />
                      <h6 className="card-title text-center">Notícias</h6>
                    </Link>
                    <Link to="/todosEventos" className="card cardazul p-1 text-white mx-2 text-decoration-none">
                      <img className="m-3" src={eventos} alt="Ícone de Eventos" />
                      <h6 className="card-title text-center">Eventos</h6>
                    </Link>
                  </div>
                </div>


              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#cardCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#cardCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <div className="row justify-content-center text-center">
              <Link to={`/todosturismos/${5}`} className="card cardlaranja m-2 text-white text-decoration-none">
                <img className="m-3" src={cultura} alt="icone cultura" />
                <h6 className="card-title">Cultura</h6>
              </Link>

              <Link to={`/todosturismos/${6}`} className="card cardazul m-2 text-white text-decoration-none">
                <img className="m-4" src={rural} alt="icone rural" />
                <h6 className="card-title">Turismo Rural</h6>
              </Link>

              <Link to="/todasEmpresas" className="card cardlaranja m-2 text-white text-decoration-none">
                <img className="m-4" src={empresa} alt="icone loja" />
                <h6 className="card-title">Empresas</h6>
              </Link>

              <Link to={`/todosturismos/${7}`} className="card cardazul m-2 text-white text-decoration-none">
                <img className="m-4" src={saude} alt="icone saude" />
                <h6 className="card-title">Saúde</h6>
              </Link>

              <Link to="/todasNoticias" className="card cardlaranja m-2 text-white text-decoration-none">
                <img className="m-4" src={noticia} alt="icone notícias" />
                <h6 className="card-title">Notícias</h6>
              </Link>

              <Link to="/todosEventos" className="card cardazul m-2 text-white text-decoration-none">
                <img className="m-4" src={eventos} alt="icone eventos" />
                <h6 className="card-title">Eventos</h6>
              </Link>
            </div>



          )}
        </div>
        <div className="w-full px-14">
          <hr className="w-full  my-6 opacity-40  border-[#373636] border-1 rounded" />
        </div>
        <div className="flex w-full flex-col mb-4 text-gray-900">
          <div className="flex flex-col md:flex-row w-full bg-[#ED7833]">
            <h4 className="w-full md:w-1/2 px-8 text-white text-lg py-2 flex items-center justify-center">{parametro.descricaoEntreRios}</h4>
            <img className="h-[356px] w-full md:w-1/2 object-cover" src={parametro.imagemEntreRios} />
          </div>
          <div className="flex flex-col md:flex-row w-full bg-[#58AFAE] text-white">
            <img className="h-[356px] w-full md:w-1/2 object-cover" src={parametro.imagemIT} />
            <h4 className="w-full md:w-1/2 px-5 flex items-center py-2 text-lg justify-center">{parametro.descricaoIT}</h4>
          </div>
        </div>

        <div className="inline-flex items-center justify-center w-full p-4">
          <hr className="w-full h-1 my-6 opacity-100 bg-[#58AFAE] border-0 rounded" />
          <div className="absolute justify-center items-center px-4 -translate-x-1/2 bg-white left-1/2">
            <h1 className="text-[#373636] sm:text-2xl text-sm font-bold px-6">
              NOTÍCIAS
            </h1>
          </div>
        </div>

        <div className="flex justify-center items-center">
          {/* Cards de outras notícias */}
          <div className="pt-5 pb-5 px-2 text-xs sm:pl-32 sm:pr-32 sm:min-w-[320px] lg:w-[90%] xl:w-[80%] 2xl:w-[70%]">
            {outrasNoticias.map((outraNoticia) => (
              <div key={outraNoticia.id} className="p-4">
                <div className="grid grid-cols-2 h-[140px] sm:h-[300px] border-2 border-[#DBDBDB]">
                  {outraNoticia.imagemNoticia[0] && (
                    <img
                      src={outraNoticia.imagemNoticia[0]?.imagem}
                      alt="Preview"
                      className="flex w-full h-[136px] sm:h-[290px]"
                    />
                  )}
                  <div className="pl-6 pt-3">
                    <h2 className="truncate pr-6 text-[#373636] text-ellipsis overflow-hidden font-semibold text-xs sm:text-base uppercase">
                      {outraNoticia.titulo}
                    </h2>
                    <h2 className="truncate pr-6 pt-1 text-[#373636] font-normal text-xs sm:text-bas">
                      {outraNoticia.subtitulo}
                    </h2>

                    <div className="flex">
                      <button
                        className="mt-6 bg-[#58AFAE] text-xs sm:text-bas text-[#373636]font-medium hover:scale-105 hover:bg-[#ED7833] text-white w-20 h-6 sm:w-32 sm:h-10"
                        onClick={() =>
                          navigate(`/visualizarNoticia/${outraNoticia.id}`)
                        }
                      >
                        Leia Mais
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute bottom-0 right-0">
                    <div className="flex justify-center items-center text-[10px] sm:text-xs text-white  font-medium bg-[#ED7833] w-20 h-4 sm:w-32 sm:h-8">
                      {formatarDataParaExibicao(outraNoticia.dataPublicacao)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterUsr />
    </div>
  );
}

export default Inicio;