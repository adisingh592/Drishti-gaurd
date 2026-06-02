from __future__ import annotations

from drishti_ml.downloaders.weapon_openimages import WeaponOpenImagesDownloader


class SohasDownloader(WeaponOpenImagesDownloader):
    """SOHAS / OD-WeaponDetection weapon imagery."""

    name = "sohas_weapon"

    def download(self):
        self.cfg["sohas_url"] = self.cfg.get(
            "url",
            "https://github.com/ari-dasci/OD-WeaponDetection/archive/refs/heads/master.zip",
        )
        return super().download()
