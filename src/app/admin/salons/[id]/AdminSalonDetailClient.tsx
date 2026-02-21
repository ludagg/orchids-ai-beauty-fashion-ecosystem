"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveSalon, rejectSalon, suspendSalon } from "@/app/admin/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, MapPin, Globe, ExternalLink, FileText, Phone, Mail, User } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Salon {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  status: string;
  address: string;
  city: string;
  state: string | null;
  country: string | null;
  zipCode: string;
  formattedAddress: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  phone: string | null;
  website: string | null;
  logo: string | null;
  image: string | null;
  registrationNumber: string | null;
  idDocumentUrl: string | null;
  businessProofUrl: string | null;
  galleryUrls: string[] | null;
  createdAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone?: string | null;
  };
  images: { url: string }[];
}

export default function AdminSalonDetailClient({ salon }: { salon: Salon }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject' | 'suspend') => {
      if (!confirm(`Are you sure you want to ${action} this salon?`)) return;

      setLoading(true);
      try {
          if (action === 'approve') await approveSalon(salon.id);
          if (action === 'reject') await rejectSalon(salon.id);
          if (action === 'suspend') await suspendSalon(salon.id);

          toast.success(`Salon ${action}ed successfully`);
          router.refresh();
      } catch (error) {
          console.error(error);
          toast.error(`Failed to ${action} salon`);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Link href="/admin/salons" className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                  <h1 className="text-2xl font-bold">{salon.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          salon.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          salon.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          salon.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                          {salon.status}
                      </span>
                      <span className="text-sm text-muted-foreground">• {salon.category || "Uncategorized"}</span>
                      <span className="text-sm text-muted-foreground">• Joined {new Date(salon.createdAt).toLocaleDateString()}</span>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-3">
              {salon.status === 'pending' && (
                  <>
                      <Button variant="destructive" onClick={() => handleAction('reject')} disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                          Reject
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction('approve')} disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                          Approve
                      </Button>
                  </>
              )}
              {salon.status === 'active' && (
                  <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleAction('suspend')} disabled={loading}>
                      Suspend
                  </Button>
              )}
              {salon.status === 'suspended' && (
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction('approve')} disabled={loading}>
                      Reactivate
                  </Button>
              )}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
              {/* Business Info */}
              <section className="bg-card p-6 rounded-2xl border space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Business Details
                  </h3>
                  <div className="grid gap-4">
                      <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase">Description</label>
                          <p className="mt-1 text-sm leading-relaxed">{salon.description || "No description provided."}</p>
                      </div>
                      <div className="flex items-center gap-6">
                          {salon.website && (
                              <div>
                                  <label className="text-xs font-medium text-muted-foreground uppercase">Website</label>
                                  <a href={salon.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-1 text-sm text-blue-600 hover:underline">
                                      <Globe className="w-4 h-4" />
                                      {salon.website}
                                  </a>
                              </div>
                          )}
                          {salon.category && (
                              <div>
                                  <label className="text-xs font-medium text-muted-foreground uppercase">Category</label>
                                  <p className="mt-1 text-sm font-medium">{salon.category}</p>
                              </div>
                          )}
                      </div>
                  </div>
              </section>

              {/* Location */}
              <section className="bg-card p-6 rounded-2xl border space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Location
                  </h3>
                  <div className="grid gap-2">
                      <p className="font-medium">{salon.address}</p>
                      <p>{salon.city}, {salon.state} {salon.zipCode}</p>
                      <p>{salon.country}</p>
                      {salon.formattedAddress && (
                          <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                              <span className="font-medium text-foreground">Detected:</span> {salon.formattedAddress}
                          </p>
                      )}

                      <div className="mt-4 h-[300px] bg-muted rounded-xl overflow-hidden relative">
                         {/* Simple Map Preview using iframe or just a placeholder if no coords */}
                         {salon.latitude && salon.longitude ? (
                             <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(salon.longitude)-0.01},${Number(salon.latitude)-0.01},${Number(salon.longitude)+0.01},${Number(salon.latitude)+0.01}&layer=mapnik&marker=${salon.latitude},${salon.longitude}`}
                             ></iframe>
                         ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground">
                                 No coordinates available
                             </div>
                         )}
                      </div>
                  </div>
              </section>

              {/* Documents */}
              <section className="bg-card p-6 rounded-2xl border space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Verification Documents
                  </h3>
                  <div className="grid gap-4">
                      <div className="p-4 bg-secondary/50 rounded-xl flex items-center justify-between">
                          <div>
                              <p className="text-sm font-medium">Registration Number</p>
                              <p className="text-lg font-bold font-mono">{salon.registrationNumber || "N/A"}</p>
                          </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-xl space-y-3">
                              <p className="text-sm font-medium text-muted-foreground">Owner ID</p>
                              {salon.idDocumentUrl ? (
                                  <a href={salon.idDocumentUrl} target="_blank" rel="noopener noreferrer" className="block group relative aspect-video bg-muted rounded-lg overflow-hidden">
                                       {salon.idDocumentUrl.toLowerCase().endsWith('.pdf') ? (
                                           <div className="flex items-center justify-center h-full bg-red-50 text-red-600">
                                               <FileText className="w-8 h-8" />
                                               <span className="ml-2 font-bold">PDF</span>
                                           </div>
                                       ) : (
                                           <img src={salon.idDocumentUrl} alt="ID" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                       )}
                                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                           <ExternalLink className="text-white w-6 h-6" />
                                       </div>
                                  </a>
                              ) : (
                                  <div className="text-sm text-red-500">Missing</div>
                              )}
                          </div>

                          <div className="p-4 border rounded-xl space-y-3">
                              <p className="text-sm font-medium text-muted-foreground">Business Proof</p>
                              {salon.businessProofUrl ? (
                                  <a href={salon.businessProofUrl} target="_blank" rel="noopener noreferrer" className="block group relative aspect-video bg-muted rounded-lg overflow-hidden">
                                       {salon.businessProofUrl.toLowerCase().endsWith('.pdf') ? (
                                           <div className="flex items-center justify-center h-full bg-red-50 text-red-600">
                                               <FileText className="w-8 h-8" />
                                               <span className="ml-2 font-bold">PDF</span>
                                           </div>
                                       ) : (
                                           <img src={salon.businessProofUrl} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                       )}
                                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                           <ExternalLink className="text-white w-6 h-6" />
                                       </div>
                                  </a>
                              ) : (
                                  <div className="text-sm text-red-500">Missing</div>
                              )}
                          </div>
                      </div>
                  </div>
              </section>

              {/* Gallery */}
              <section className="bg-card p-6 rounded-2xl border space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {salon.logo && (
                          <div className="aspect-square rounded-xl border p-2 flex items-center justify-center relative group">
                              <img src={salon.logo} alt="Logo" className="w-full h-full object-contain" />
                              <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded">LOGO</span>
                          </div>
                      )}
                      {(salon.galleryUrls || (salon.images && salon.images.map(i => i.url)) || []).map((url, i) => (
                           <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl overflow-hidden border relative group">
                               <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           </a>
                      ))}
                  </div>
              </section>
          </div>

          {/* Sidebar: Owner Info */}
          <div className="lg:col-span-1 space-y-6">
              <section className="bg-card p-6 rounded-2xl border space-y-6 sticky top-8">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Owner Info
                  </h3>

                  <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden mb-4 border-4 border-background shadow-sm">
                          {salon.owner.image ? (
                              <img src={salon.owner.image} alt={salon.owner.name} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <User className="w-8 h-8 text-muted-foreground" />
                              </div>
                          )}
                      </div>
                      <h4 className="font-bold text-lg">{salon.owner.name}</h4>
                      <p className="text-sm text-muted-foreground">Partner since {new Date(salon.createdAt).getFullYear()}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                              <p className="text-xs font-bold text-muted-foreground uppercase">Email</p>
                              <a href={`mailto:${salon.owner.email}`} className="text-sm font-medium truncate block hover:underline">{salon.owner.email}</a>
                          </div>
                      </div>

                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                              <p className="text-xs font-bold text-muted-foreground uppercase">Phone</p>
                              {salon.phone || salon.owner.phone ? (
                                  <a href={`tel:${salon.phone || salon.owner.phone}`} className="text-sm font-medium truncate block hover:underline">
                                      {salon.phone || salon.owner.phone}
                                  </a>
                              ) : (
                                  <span className="text-sm text-muted-foreground">Not provided</span>
                              )}
                          </div>
                      </div>
                  </div>
              </section>
          </div>
      </div>
    </div>
  );
}
