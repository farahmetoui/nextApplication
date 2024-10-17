"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { reverseGeocode, validateAddress } from "../../lib/distanceService";
const MapOverlay = dynamic(() => import("../../app/components/map"), {
  ssr: false,
});

type UserDetails = {
  _id: string;
  firstName: string;
  lastName: string;
  address: [number, number];
  dateOfBirth: string;
  phoneNumber: string;
};

const EditUserProfile = ({
  initialUserDetails,
}: {
  initialUserDetails: UserDetails;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);
  const [mapOpen, setMapOpen] = useState(false);
  const [isValid, setValid] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [address, setAddress] = useState<[number, number] | null>(null);

  const [formData, setFormData] = useState({
    imageSrc: session?.user?.image || "/default-profile.png",
  });
  const handleProfileClick = () => {
    router.replace('/user/profile');
  };

  const toggleMap = () => {
    setMapOpen(!mapOpen);
  };
  const saveMap = async () => {
    if (selectedLocation) {
      const newLat = selectedLocation.lat;
      const newLng = selectedLocation.lng;

      const adresse = await reverseGeocode(newLat, newLng);

      if (adresse) {
        const isValidAddress = await validateAddress(adresse);

        if (isValidAddress) {
          setValid(true);
          setAddress([newLat, newLng]);
          setMapOpen(!mapOpen);
        } else {
          window.alert("L'adresse sélectionnée est à plus de 50 km de Paris.");
        }
      }
    } else {
      setAddress(null);
    }
  };

  const fetchUserDetails = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/userDetails/${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error(
            "Erreur lors de la récupération des détails utilisateur"
          );
        }
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      }
    }
  };

  const UpdateUser = async (
    id: string,
    userData: {
      firstName: string;
      lastName: string;
      address: [number, number] | null;
      phoneNumber: string;
      dateOfBirth: string;
    }
  ) => {
    if (session) {
      try {
        const response = await fetch(`/api/updateUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: id,
            updatedData: userData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error(
            "Erreur lors de la mise à jour des détails utilisateur"
          );
        }
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userDetails) {
      const payload = {
        userId: userDetails._id,
        updatedData: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          dateOfBirth: userDetails.dateOfBirth,
          address,
          phoneNumber: userDetails.phoneNumber,
        },
      };
      if (isValid) {
        await UpdateUser(payload.userId, payload.updatedData);
        router.replace("/user/profile");
      } 
      
    } else {
      console.error("userDetails is null, cannot update user.");
    }
  };


  useEffect(() => {
    if (session && session.user) {
      if (session?.user?.email) {
        fetchUserDetails();
        saveMap();
      }

      setFormData({
        imageSrc: session?.user?.image || "/default-profile.png",
      });
    }
  }, [session]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-200">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg relative">
        <a
          href="javascript:void(0);"
          className="font-normal text-pink-500"
          onClick={handleSignOut}
        >
          SignOut
        </a>
        <div className="flex justify-center mb-6">
          <Image
            alt="Profile Picture"
            src={formData.imageSrc}
            className="shadow-xl rounded-full h-auto align-middle border-none"
            width={150}
            height={150}
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-6 text-pink-500">
            Modifier tes informations :
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Nom :</label>
                <input
                  type="text"
                  name="lastName"
                  value={userDetails?.lastName || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none text-slate-500 focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Prénom :</label>
                <input
                  type="text"
                  name="firstName"
                  value={userDetails?.firstName || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none text-slate-500 focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">
                  Date de naissance :
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={userDetails?.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none text-slate-500 focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex-5 -mr-35 w-48">
                <h1 className="text-gray-700">Adresse :</h1>

                {mapOpen ? (
                  <MapOverlay
                    lat={selectedLocation?.lat || 48.85837}
                    lng={selectedLocation?.lng || 2.294481}
                    onLocationSelect={setSelectedLocation}
                    saveMap={saveMap}
                    onClose={() => setMapOpen(!mapOpen)}
                  />
                ) : (
                  <div
                    style={{
                      width: "220px",
                      height: "45px",
                      backgroundColor: "#f0f0f0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                    onClick={toggleMap}
                  >
                    <Image
                      src="/images/mapp.jpg"
                      alt="map"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Numéro de téléphone :
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={userDetails?.phoneNumber || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none text-slate-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              className="flex items-center bg-pink-300 text-white gap-1 px-4 py-2 cursor-pointer text-gray-800 font-semibold tracking-widest rounded-md hover:bg-pink-500 duration-300 hover:gap-2 hover:translate-x-3"
            >
              Send
              <svg
                className="w-5 h-5"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>

           
          </form>
          <button onClick={handleProfileClick} className="flex items-start mx-80 -mt-10 bg-pink-300 text-white gap-1 px-4 py-2 cursor-pointer text-gray-800 font-semibold tracking-widest rounded-md hover:bg-pink-500 duration-300 hover:gap-2 hover:translate-x-3">
              Profile
              <svg
                className="w-5 h-5"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
