import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "font-awesome/css/font-awesome.min.css";
import Head from "next/head";
import Image from "next/image";
import Chatbot from "../../app/components/chatbot";
import { reverseGeocode } from "../../lib/distanceService";
const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<{
    firstName: string;
    lastName: string;
    address: [number, number];
    dateOfBirth: string;
    phoneNumber: string;
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [addresse, setAdresse] = useState<string>("");

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/userDetails/${session.user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
            console.log("User details fetched");
          } else {
            console.error("Error fetching user details");
          }
        } catch (error) {
          console.error("API call error:", error);
        } finally {
          setLoadingDetails(false);
        }
      }
    };

    fetchUserDetails();
  }, [session?.user?.email]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (userDetails && Array.isArray(userDetails.address)) {
        const [lat = 0, lng = 0] = userDetails.address;
        const address = await reverseGeocode(lat, lng);
        setAdresse(address || "");
      } else {
        console.error("userDetails.address is not an array:");
      }
    };

    fetchAddress();
  }, [userDetails]);
  if (status === "loading" || loadingDetails) {
    return <p>Chargement...</p>;
  }

  if (!session || !session.user) {
    return <p>Vous n êtes pas connecté.</p>;
  }

  const {  image } = session.user;

  const handleEditClick = () => {
    router.push("/user/edit-profile");
  };

  return (
    <>
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
          />
          <link
            rel="stylesheet"
            href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
          />
        </Head>
        <section className="pt-16 bg-blueGray-50">
          <div className="w-full lg:w-4/12 px-4 mx-auto">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
              <div className="px-6">
                <a
                  href="javascript:void(0);"
                  className="font-normal text-pink-500"
                  onClick={handleSignOut}
                >
                  LogOut
                </a>
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4 flex justify-center">
                    <div className="relative">
                      <Image
                        alt="Profile Picture"
                        src={image ?? "/default-profile.png"}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                        width={150}
                        height={150}
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 text-center mt-20">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="-mr-7 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          Welcome
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {userDetails?.firstName } {userDetails?.lastName }
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {addresse || "Adresse non disponible"}
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-10">
                    <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>

                    {userDetails?.phoneNumber ||
                      "numero de telephone non disponible"}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
                    {userDetails?.dateOfBirth || "date non disponible"}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        Merci de nous avoir rejoints ! Nous sommes ravis de vous
                        accueillir dans notre application. Restez à l affût des
                        mises à jour et des nouvelles fonctionnalités pour
                        améliorer votre expérience.
                      </p>

                      <a
                        href="javascript:void(0);"
                        className="font-normal text-pink-500"
                        onClick={handleEditClick}
                      >
                        Complete registration
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="relative pt-8 pb-6 mt-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                  <div className="text-sm text-blueGray-500 font-semibold py-1">
                    have{" "}
                    <a
                      href="https://www.creative-tim.com/product/notus-js"
                      className="text-blueGray-500 hover:text-gray-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      such
                    </a>{" "}
                    a{" "}
                    <a
                      href="https://www.creative-tim.com"
                      className="text-blueGray-500 hover:text-blueGray-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      nice day
                    </a>
                    .
                  </div>
                </div>
              </div>
            </div>
            <Chatbot />
          </footer>
        </section>
      </>
    </>
  );
};

export default UserProfile;
