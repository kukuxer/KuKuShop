import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "../../../entities";
import { Loading } from "../../../shared/ui/loading";
import { fetchTopProducts } from "../../../entities/product/api/products";

interface ProductCarouselProps {
    onLoaded?: () => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ onLoaded }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await fetchTopProducts(12);
            setProducts(data);
            onLoaded?.();
        };

        fetchProducts();
    }, [onLoaded]);

    if (products.length === 0) return <Loading />;

    const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
        <div className="flex items-center">
            <FaStar className="text-purple-400" />
            <span className="ml-1 text-white">{rating}</span>
        </div>
    );

    const CustomArrow: React.FC<{ onClick?: () => void; direction: "left" | "right" }> = ({
                                                                                              onClick,
                                                                                              direction,
                                                                                          }) => {
        const Icon = direction === "left" ? FaArrowLeft : FaArrowRight;
        return (
            <button
                onClick={onClick}
                className={`absolute top-1/2 z-10 p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors ${
                    direction === "left" ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                } -translate-y-1/2`}
                aria-label={direction === "left" ? "Previous slides" : "Next slides"}
            >
                <Icon className="text-white text-xl" />
            </button>
        );
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        prevArrow: <CustomArrow direction="left" />,
        nextArrow: <CustomArrow direction="right" />,
        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    return (
        <div className="bg-gray-900 pt-12 pb-60 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">Featured Products</h2>
                <div className="relative px-12">
                    <Slider {...settings}>
                        {products.map((product) => {
                            const isHovered = hoveredProductId === product.id;
                            return (
                                <Link to={`/products/${product.id}`} key={product.id}>
                                    <div className="px-2">
                                        <div
                                            onMouseEnter={() => setHoveredProductId(product.id)}
                                            onMouseLeave={() => setHoveredProductId(null)}
                                            className={`bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-500 ease-in-out group relative h-full ${
                                                isHovered
                                                    ? "scale-105 shadow-xl shadow-[#6A0DAD] ring-4 ring-[#6A0DAD]/30"
                                                    : "scale-100 shadow-md ring-0"
                                            } `}
                                        >
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <img
                                                    src={product.imageUrl || "/Default.png"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover object-center"
                                                    loading="lazy"
                                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                        (e.target as HTMLImageElement).src = "/Default.png";
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center px-4 text-sm text-white text-center"
                                                >
                                                    {product.description}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-white mb-2 h-16 overflow-hidden">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-purple-400 font-bold">${product.price}</span>
                                                    <StarRating rating={product.rating} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

