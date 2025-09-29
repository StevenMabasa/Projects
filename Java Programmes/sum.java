import java.util.Scanner;

public class sum {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {

            long num = scanner.nextLong();

            long sum = 0L;

            for (int i=0; i<num+1; i++) {
                sum += i;
            }

            System.out.println(sum);
        }
    }
}
