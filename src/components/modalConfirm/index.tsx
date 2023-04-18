import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CadastroEmpresaService } from "../../services/api";
import { useUserStore } from "../../stores/users";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  handleOpen,
  handleClose,
  open,
  empresa,
}: {
  handleOpen: any;
  handleClose: any;
  open: any;
  empresa: any;
}) {
  const token = useUserStore((state) => state.token);

  const Delete = () => {
    CadastroEmpresaService.delete(`/empresa/${empresa.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      window.location.reload();
    });
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Excluir Empresa
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Você tem certeza que deseja excluir essa empresa?
          </Typography>
          <div
            style={{
              marginTop: "20px",
              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Fechar
            </Button>
            <Button
              onClick={Delete}
              color="error"
              variant="contained"
              sx={{ mr: 3 }}
            >
              Excluir
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
