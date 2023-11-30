import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import { MdFacebook } from "react-icons/md";
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";

function Footer() {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          {/* Categories Links */}

          <FooterList>
            <h3 className="text-base font-bold mb-2">Categorias</h3>
            <Link href="#">Phones</Link>
            <Link href="#">Laptops</Link>
            <Link href="#">Desktops</Link>
            <Link href="#">Watches</Link>
            <Link href="#">Tvs</Link>
            <Link href="#">Accessories</Link>
          </FooterList>

          {/* Suporte ao consumidor */}

          <FooterList>
            <h3 className="text-base font-bold mb-2">Suporte ao consumidor</h3>
            <Link href="#">Contato</Link>
            <Link href="#">Politica de compra</Link>
            <Link href="#">Estorno e devolução</Link>
            <Link href="#">FAQs</Link>
          </FooterList>

          {/* Sobre nós */}

          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">Sobre Nós</h3>
            <p className="mb-2">
              A melhor loja de presentes do sul do Brasil! Contendo inúmeras
              variedades de artigos de decoração, cervejas artesanais, bebidas e
              afins.
              <p>
                &copy; {new Date().getFullYear()} E-shop. Direitos reservados
              </p>
            </p>
          </div>

          {/* Mídias sociais */}

          <FooterList>
            <h3 className="text-base font-bold mb-2">Siga-nos nas redes!</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24} />
              </Link>
              <Link href="#">
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href="#">
                <AiFillInstagram size={24} />
              </Link>
              <Link href="#">
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
