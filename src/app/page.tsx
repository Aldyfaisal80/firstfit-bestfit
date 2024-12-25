'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SimulatorAlokasi() {
	// State untuk lubang memori dengan kemampuan edit
	const [lubang, setLubang] = useState([
		{ id: 1, ukuran: 100, proses: '' },
		{ id: 2, ukuran: 500, proses: '' },
		{ id: 3, ukuran: 200, proses: '' },
		{ id: 4, ukuran: 300, proses: '' },
		{ id: 5, ukuran: 600, proses: '' },
		{ id: 6, ukuran: 50, proses: '' },
		{ id: 7, ukuran: 250, proses: '' },
	]);

	const [ukuranProses, setUkuranProses] = useState('');
	const [lubangTujuan, setLubangTujuan] = useState('');
	const [algoritma, setAlgoritma] = useState('manual');
	const [alokasi, setAlokasi] = useState<{ idLubang: number; ukuranProses: number; sisaUkuran: number }[]>([]);

	// Fungsi update ukuran lubang
	const updateUkuranLubang = (id: number, value: string) => {
		const ukuranBaru = value === '' ? 0 : parseInt(value);
		setLubang(lubang.map(l => (l.id === id ? { ...l, ukuran: isNaN(ukuranBaru) ? l.ukuran : ukuranBaru } : l)));
	};

	// Fungsi update proses di lubang
	const updateProsesLubang = (id: number, value: string) => {
		setLubang(lubang.map(l => (l.id === id ? { ...l, proses: value } : l)));
	};

	const alokasikanMemori = () => {
		const ukuran = parseInt(ukuranProses);
		const idLubang = parseInt(lubangTujuan);

		// Validasi input
		if (isNaN(ukuran) || ukuran <= 0) {
			alert('Masukkan ukuran proses yang valid');
			return;
		}

		if (isNaN(idLubang)) {
			alert('Pilih lubang tujuan');
			return;
		}

		// Cari lubang yang dipilih
		const lubangDipilih = lubang.find(l => l.id === idLubang);

		if (!lubangDipilih) {
			alert('Lubang tidak ditemukan');
			return;
		}

		// Cek algoritma alokasi
		let hasilAlokasi = null;

		switch (algoritma) {
			case 'manual':
				// Alokasi manual
				if (lubangDipilih.ukuran >= ukuran && !lubangDipilih.proses) {
					hasilAlokasi = {
						idLubang: idLubang,
						ukuranProses: ukuran,
						sisaUkuran: lubangDipilih.ukuran - ukuran,
					};

					// Update lubang
					setLubang(
						lubang.map(l =>
							l.id === idLubang
								? {
										...l,
										proses: ukuran.toString(),
										ukuran: l.ukuran - ukuran,
								  }
								: l,
						),
					);
				} else {
					alert('Lubang tidak cukup atau sudah terisi');
					return;
				}
				break;

			case 'firstFit':
				// Algoritma First Fit
				for (const l of lubang) {
					if (l.ukuran >= ukuran && !l.proses) {
						hasilAlokasi = {
							idLubang: l.id,
							ukuranProses: ukuran,
							sisaUkuran: l.ukuran - ukuran,
						};

						// Update lubang
						setLubang(
							lubang.map(hole =>
								hole.id === l.id
									? {
											...hole,
											proses: ukuran.toString(),
											ukuran: hole.ukuran - ukuran,
									  }
									: hole,
							),
						);
						break;
					}
				}
				break;

			case 'bestFit':
				// Algoritma Best Fit
				let lubangTerbaik = null;
				let sisaMinimum = Infinity;

				for (const l of lubang) {
					if (l.ukuran >= ukuran && !l.proses) {
						const sisaUkuran = l.ukuran - ukuran;
						if (sisaUkuran < sisaMinimum) {
							sisaMinimum = sisaUkuran;
							lubangTerbaik = l;
						}
					}
				}

				if (lubangTerbaik) {
					hasilAlokasi = {
						idLubang: lubangTerbaik.id,
						ukuranProses: ukuran,
						sisaUkuran: lubangTerbaik.ukuran - ukuran,
					};

					// Update lubang
					setLubang(
						lubang.map(hole =>
							hole.id === lubangTerbaik.id
								? {
										...hole,
										proses: ukuran.toString(),
										ukuran: hole.ukuran - ukuran,
								  }
								: hole,
						),
					);
				}
				break;
		}

		// Tambahkan ke riwayat alokasi jika berhasil
		if (hasilAlokasi) {
			setAlokasi([...alokasi, hasilAlokasi]);
		} else {
			alert('Tidak ada lubang yang sesuai untuk proses');
		}

		// Reset input
		setUkuranProses('');
		setLubangTujuan('');
	};

	const resetSimulasi = () => {
		setLubang([
			{ id: 1, ukuran: 100, proses: '' },
			{ id: 2, ukuran: 500, proses: '' },
			{ id: 3, ukuran: 200, proses: '' },
			{ id: 4, ukuran: 300, proses: '' },
			{ id: 5, ukuran: 600, proses: '' },
			{ id: 6, ukuran: 50, proses: '' },
			{ id: 7, ukuran: 250, proses: '' },
		]);
		setAlokasi([]);
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Simulator Alokasi Memori</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Alokasi Memori</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{/* Pilih Algoritma */}
							<Select
								value={algoritma}
								onValueChange={setAlgoritma}>
								<SelectTrigger>
									<SelectValue placeholder='Pilih Algoritma' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='manual'>Manual</SelectItem>
									<SelectItem value='firstFit'>First Fit</SelectItem>
									<SelectItem value='bestFit'>Best Fit</SelectItem>
								</SelectContent>
							</Select>

							{/* Input Ukuran Proses */}
							<Input
								type='number'
								placeholder='Masukkan Ukuran Proses (KB)'
								value={ukuranProses}
								onChange={e => setUkuranProses(e.target.value)}
							/>

							{/* Pilih Lubang Tujuan */}
							<Select
								value={lubangTujuan}
								onValueChange={setLubangTujuan}>
								<SelectTrigger>
									<SelectValue placeholder='Pilih Lubang Tujuan' />
								</SelectTrigger>
								<SelectContent>
									{lubang.map(hole => (
										<SelectItem
											key={hole.id}
											value={hole.id.toString()}
											disabled={hole.proses !== ''}>
											Lubang {hole.id} - {hole.ukuran} KB
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<div className='flex space-x-2'>
								<Button onClick={alokasikanMemori}>Alokasikan Memori</Button>
								<Button
									variant='secondary'
									onClick={resetSimulasi}>
									Reset
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Daftar Lubang Memori */}
				<Card>
					<CardHeader>
						<CardTitle>Lubang Memori Saat Ini</CardTitle>
					</CardHeader>
					<CardContent>
						{lubang.map(hole => (
							<div
								key={hole.id}
								className='grid grid-cols-3 gap-2 items-center border-b py-2'>
								<Input
									type='number'
									value={hole.ukuran}
									onChange={e => updateUkuranLubang(hole.id, e.target.value)}
									placeholder='Ukuran (KB)'
								/>
								<Input
									type='number'
									value={hole.proses}
									onChange={e => updateProsesLubang(hole.id, e.target.value)}
									placeholder='Proses (KB)'
									disabled
								/>
								<span>Lubang {hole.id}</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Riwayat Alokasi */}
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>Riwayat Alokasi</CardTitle>
				</CardHeader>
				<CardContent>
					{alokasi.map((alloc, index) => (
						<div
							key={index}
							className='flex justify-between border-b py-2'>
							<span>Proses dialokasikan ke Lubang {alloc.idLubang}</span>
							<span>
								Ukuran: {alloc.ukuranProses} KB, Sisa: {alloc.sisaUkuran} KB
							</span>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
